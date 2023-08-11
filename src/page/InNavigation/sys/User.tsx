import { Button, Divider, Form, Modal, Space, TableProps, Tag, message } from 'antd'
import EnquiryForm from '../../../components/EnquiryForm'
import PageHeader from '../../../components/PageHeader'
import { createFormItem, formItem } from '../../../utils/createFormItem'
import { password } from '../../../utils/regexp'
import { useEffect, useRef, useState } from 'react'
import fetchJson from '../../../utils/fetch'
import PopConfirmDelete from '../../../components/PopConfirmDelete'
import BaseList from '../../../interface/BaseList'

export const basicUserFormItems: formItem[] = [
	{
		type: 'input',
		itemOptions: {
			label: '用户名',
			name: 'userName',
			rules: [{ required: true }],
		},
		inputOptions: {
			placeholder: '登录系统使用的账号名称，仅支持字母和数字',
		},
	},
	{
		type: 'password',
		itemOptions: {
			label: '密码',
			name: 'password',
			rules: [
				{
					required: true,
					message: '输入你的密码',
				},
				() => ({
					validator(_, value) {
						const regexp = new RegExp(password)
						if (regexp.test(value)) {
							return Promise.resolve()
						}
						return Promise.reject(new Error('密码8-16位，至少包含大写字母，小写字母和数字'))
					},
				}),
			],
			hasFeedback: true,
		},
		inputOptions: {
			placeholder: '8-16位，至少包含大写字母，小写字母和数字',
		},
	},
	{
		type: 'password',
		itemOptions: {
			label: '确认密码',
			name: 'confirm',
			dependencies: ['password'],
			rules: [
				{
					required: true,
					message: '确认你的密码',
				},
				({ getFieldValue }) => ({
					validator(_, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve()
						}
						return Promise.reject(new Error('两次输入的密码不一致'))
					},
				}),
			],
			hasFeedback: true,
		},
		inputOptions: {
			placeholder: '重复你的密码',
		},
	},
]
interface userList extends BaseList {
	id: number
	userName: string
	realName: string
	phone: string
	status: string
	avtar: string
	roles: { roleName: string; id: string }[]
	roleIds?: string[]
}
export default () => {
	const table = useRef<{ getData: Function }>()
	const [form] = Form.useForm()
	//----------------------------------------  ----------------------------------------
	const [open, setopen] = useState(false)
	const [edit, setedit] = useState(false)
	const [roles, setroles] = useState<any[]>([])
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		getRoles()
	}, [])

	//----------------------------------------  ----------------------------------------
	const closeModal = () => {
		form.resetFields()
		setopen(false)
		setedit(false)
	}
	const onEdit = (data: userList) => {
		setedit(true)
		setopen(true)
		let _data = { ...data }
		_data.roleIds = _data.roles.map((ele) => ele.id)
		form.setFieldsValue(_data)
	}
	const submit = () => {
		form.validateFields().then((values) => {
			let id = values.id
			let api = id ? '/user/edit' : '/user/add'
			let body = { ...values }
			body = JSON.stringify(body)
			fetchJson(api, { method: 'POST', body }).then(() => {
				closeModal()
				message.success('提交成功')
				getTableData()
			})
		})
	}

	const getTableData = () => {
		table.current?.getData()
	}

	const getRoles = () => {
		fetchJson('/role/list?pageSize=99').then((values) => {
			let _roleOptions = values.result.records.map(({ roleName, id }: any) => ({
				value: id,
				label: roleName,
			}))
			setroles(_roleOptions)
		})
	}
	//----------------------------------------  ----------------------------------------
	const columns: TableProps<userList>['columns'] = [
		{
			dataIndex: 'userName',
			title: '用户名',
		},
		{
			dataIndex: 'realName',
			title: '使用人',
		},
		{
			dataIndex: 'phone',
			title: '电话',
		},
		{
			dataIndex: 'roles',
			title: '角色',
			render: (value) =>
				value?.map((ele: any) => (
					<Tag key={ele.id} color='blue'>
						{ele.roleName}
					</Tag>
				)),
		},
		{
			title: '操作',
			render: (_, record) => (
				<Space>
					<PopConfirmDelete id={record.id} api='/user/delete' onDeleteOk={getTableData} />
					<Button type='link' size='small' onClick={() => onEdit(record)}>
						编辑
					</Button>
				</Space>
			),
		},
	]
	const searchItems: formItem[] = [
		{
			itemOptions: {
				name: 'userName',
				label: '用户名',
			},
		},
	]
	const content = (
		<Button type='primary' onClick={() => setopen(true)}>
			新增
		</Button>
	)
	const userFormItems: formItem[] = [
		{
			itemOptions: {
				name: 'id',
				hidden: true,
			},
		},
		...(edit ? [] : basicUserFormItems),
		{
			itemOptions: {
				name: 'realName',
				label: '使用人',
				rules: [{ required: true }],
			},
		},
		{
			itemOptions: {
				name: 'phone',
				label: '手机',
			},
		},
		{
			type: 'select',
			itemOptions: {
				name: 'roleIds',
				label: '角色',
				rules: [{ required: true }],
			},
			inputOptions: {
				mode: 'multiple',
				options: roles,
			},
		},
	]
	return (
		<>
			<PageHeader />
			<EnquiryForm
				api='/user/list'
				tableProps={{ columns }}
				searchItems={searchItems}
				ref={table}
				content={content}
			/>
			<Modal title='用户管理' open={open} onCancel={closeModal} onOk={submit}>
				<Form labelCol={{ span: 4 }} form={form}>
					<Divider />
					{userFormItems.map(createFormItem)}
				</Form>
			</Modal>
		</>
	)
}
