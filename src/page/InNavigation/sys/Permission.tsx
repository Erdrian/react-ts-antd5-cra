import { Button, Drawer, Form, Space, TableProps, message } from 'antd'
import EnquiryForm from '../../../components/EnquiryForm'
import PageHeader from '../../../components/PageHeader'
import { createFormItem, formItem } from '../../../utils/createFormItem'
import { useEffect, useRef, useState } from 'react'
import fetchJson from '../../../utils/fetch'
import PopConfirmDelete from '../../../components/PopConfirmDelete'

export interface permission {
	id: string
	name: string
	authority?: string
	navigation: boolean
	route: boolean
	parentId?: string
	orderNum?: number
	path?: string
	title?: string
	icon?: string
	children?: permission[]
	key?: string
}
export default () => {
	const [form] = Form.useForm()
	const table = useRef<{ getData: Function }>(null)
	//----------------------------------------  ----------------------------------------
	const [isNavigation, setisNavigation] = useState(false)
	const [open, setopen] = useState(false)
	const [permissionsTree, setpermissionsTree] = useState<any>([])
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		getAllPermissions()
	}, [])
	//----------------------------------------  ----------------------------------------
	const finish = () => {
		message.success('提交成功')
		getAllData()
		closeDrawer()
	}
	const getAllData = () => {
		getAllPermissions()
		table.current?.getData()
	}
	const closeDrawer = () => {
		setopen(false)
		setisNavigation(false)
		form.resetFields()
	}
	const addChildren = (id: string) => {
		setopen(true)
		form.setFieldValue('parentId', id)
	}
	const onEdit = (record: permission) => {
		setopen(true)
		setisNavigation(record.navigation)
		form.setFieldsValue(record)
	}
	const getAllPermissions = () => {
		fetchJson('/permission/allPermissions').then((value) => {
			let result: permission[] = value.result
			setpermissionsTree(getPermissionsTree(result))
		})
		function getPermissionsTree(permissions: permission[]): any[] {
			return permissions.map(({ id, name, children }) => ({
				value: id,
				title: name,
				children: children ? getPermissionsTree(children) : null,
			}))
		}
	}
	const submit = () => {
		form.validateFields().then((values) => {
			let id = values.id
			let api = id ? '/permission/edit' : '/permission/add'
			let body = JSON.stringify(values)
			fetchJson(api, { method: 'POST', body }).then(finish)
		})
	}
	//----------------------------------------  ----------------------------------------
	const columns: TableProps<permission>['columns'] = [
		{
			dataIndex: 'name',
			title: '权限名称',
		},
		{
			dataIndex: 'authority',
			title: '权限标识',
		},
		{
			dataIndex: 'orderNum',
			title: '排序',
		},
		{
			dataIndex: 'path',
			title: '路径',
		},
		{
			dataIndex: 'title',
			title: '菜单名称',
		},
		{
			dataIndex: 'icon',
			title: '图标',
		},
		{
			title: '操作',
			render: (_, record) => {
				let { id } = record
				return (
					<Space>
						<PopConfirmDelete api='/permission/delete' id={id} onDeleteOk={getAllData} />
						<Button type='link' onClick={() => onEdit(record)}>
							编辑
						</Button>
						<Button type='link' onClick={() => addChildren(id)}>
							添加下级
						</Button>
					</Space>
				)
			},
		},
	]
	const formItems: formItem[] = [
		{
			itemOptions: {
				name: 'id',
				hidden: true,
			},
		},
		{
			itemOptions: {
				label: '权限名称',
				name: 'name',
				rules: [{ required: true }],
			},
		},
		{
			itemOptions: {
				label: '权限标识',
				name: 'authority',
			},
		},
		{
			type: 'treeSelect',
			itemOptions: {
				label: '父级权限',
				name: 'parentId',
			},
			inputOptions: {
				treeData: permissionsTree,
			},
		},
		{
			type: 'switch',
			itemOptions: {
				label: '是否菜单',
				name: 'navigation',
				initialValue: false,
				rules: [{ required: true }],
			},
			inputOptions: {
				onChange: (checked: boolean) => setisNavigation(checked),
			},
		},
		...(isNavigation
			? [
					{
						itemOptions: {
							label: '菜单名称',
							name: 'title',
							rules: [{ required: true }],
						},
					},
					{
						itemOptions: {
							label: '路径',
							name: 'path',
						},
					},
					{
						itemOptions: {
							label: '图标',
							name: 'icon',
						},
					},
			  ]
			: []),
		{
			type: 'switch',
			itemOptions: {
				label: '是否路由',
				name: 'route',
				initialValue: false,
				rules: [{ required: true }],
			},
		},
		{
			type: 'inputNumber',
			itemOptions: {
				label: '排序',
				name: 'orderNum',
			},
		},
	]
	const searchItems: formItem[] = [
		{
			itemOptions: {},
		},
	]
	const content = (
		<>
			<Button type='primary' onClick={() => setopen(true)}>
				新增
			</Button>
		</>
	)
	const extra = (
		<Space>
			<Button>取消</Button>
			<Button onClick={submit} type='primary'>
				提交
			</Button>
		</Space>
	)
	return (
		<>
			<PageHeader />
			<EnquiryForm
				ref={table}
				api='/permission/allPermissions'
				tableProps={{ columns }}
				content={content}
				searchItems={searchItems}
			/>
			<Drawer title='权限管理' open={open} onClose={closeDrawer} extra={extra}>
				<Form form={form} layout='vertical'>
					{formItems.map(createFormItem)}
				</Form>
			</Drawer>
		</>
	)
}
