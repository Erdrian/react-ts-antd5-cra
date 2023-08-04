import { Button, Divider, Form, Modal, Space, TableProps, message } from 'antd'
import EnquiryForm from '../../../components/EnquiryForm'
import PageHeader from '../../../components/PageHeader'
import { createFormItem, formItem } from '../../../utils/createFormItem'
import { useRef, useState } from 'react'
import fetchJson from '../../../utils/fetch'
import PopConfirmDelete from '../../../components/PopConfirmDelete'
import BaseList from '../../../interface/BaseList'

interface userList extends BaseList {
	id: number
	roleName: string
}
export default () => {
	const table = useRef<{ getData: Function }>()
	const [form] = Form.useForm()
	//----------------------------------------  ----------------------------------------
	const [open, setopen] = useState(false)
	//----------------------------------------  ----------------------------------------
	const closeModal = () => {
		form.resetFields()
		setopen(false)
	}
	const onEdit = (data: userList) => {
		setopen(true)
		form.setFieldsValue(data)
	}
	const submit = () => {
		form.validateFields().then((values) => {
			let id = values.id
			let api = id ? '/role/edit' : '/role/add'
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
	//----------------------------------------  ----------------------------------------
	const columns: TableProps<userList>['columns'] = [
		{
			dataIndex: 'roleName',
			title: '角色名称',
		},
		{
			title: '操作',
			render: (_, record) => (
				<Space>
					<PopConfirmDelete id={record.id} api='/role/delete' onDeleteOk={getTableData} />
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
				name: 'roleName',
				label: '角色名称',
			},
		},
	]
	const content = (
		<Button type='primary' onClick={() => setopen(true)}>
			新增
		</Button>
	)
	const roleFormItems: formItem[] = [
		{
			itemOptions: {
				name: 'id',
				hidden: true,
			},
		},
		{
			itemOptions: {
				name: 'roleName',
				label: '角色名称',
				rules: [{ required: true }],
			},
		},
	]
	return (
		<>
			<PageHeader />
			<EnquiryForm
				api='/role/list'
				tableProps={{ columns }}
				searchItems={searchItems}
				ref={table}
				content={content}
			/>
			<Modal title='用户管理' open={open} onCancel={closeModal} onOk={submit}>
				<Form labelCol={{ span: 4 }} form={form}>
					<Divider />
					{roleFormItems.map(createFormItem)}
				</Form>
			</Modal>
		</>
	)
}
