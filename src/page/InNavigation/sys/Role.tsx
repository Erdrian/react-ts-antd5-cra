import { Button, Divider, Drawer, Form, Modal, Space, TableProps, Tree, message } from 'antd'
import EnquiryForm from '../../../components/EnquiryForm'
import PageHeader from '../../../components/PageHeader'
import { createFormItem, formItem } from '../../../utils/createFormItem'
import { useEffect, useRef, useState } from 'react'
import fetchJson from '../../../utils/fetch'
import PopConfirmDelete from '../../../components/PopConfirmDelete'
import BaseList from '../../../interface/BaseList'
import { permission } from './Permission'
import { DataNode } from 'antd/es/tree'

interface userList extends BaseList {
	id: string
	roleName: string
}
export default () => {
	const table = useRef<{ getData: Function }>()
	const [form] = Form.useForm()
	//----------------------------------------  ----------------------------------------
	const [modalOpen, setmodalOpen] = useState(false)
	const [drawerOpen, setdrawerOpen] = useState(false)
	const [checkedKeys, setcheckedKeys] = useState<(string | number)[]>([])
	const [roleId, setroleId] = useState<string | null>(null)
	const [treeData, settreeData] = useState<DataNode[]>([])
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		getTreeData()
	}, [])

	//----------------------------------------  ----------------------------------------
	const closeModal = () => {
		form.resetFields()
		setmodalOpen(false)
	}
	const closeDrwaer = () => {
		setroleId(null)
		setcheckedKeys([])
		setdrawerOpen(false)
	}
	const onEdit = (data: userList) => {
		setmodalOpen(true)
		form.setFieldsValue(data)
	}
	const onAuthorize = (roleId: string) => {
		setroleId(roleId)
		getRolePermissions(roleId)
		setdrawerOpen(true)
	}
	const authorize = () => {
		let body = JSON.stringify({ roleId, permissionIds: checkedKeys })
		fetchJson('/role/roleLinkPermission', { method: 'POST', body }).then(() => {
			message.success('授权成功')
			closeDrwaer()
		})
	}
	const getRolePermissions = (roleId: string) => {
		fetchJson(`/role/getRolePermissions?roleId=${roleId}`).then(({ result }) => {
			setcheckedKeys(result)
		})
	}
	const checkAll = () => {
		setcheckedKeys(getTreeKeys())
	}
	const getTreeKeys = () => {
		let treeKeys: (string | number)[] = []
		const _getTreeKeys = (data: DataNode[]) => {
			data.forEach(({ key, children }) => {
				treeKeys.push(key)
				if (children) {
					_getTreeKeys(children)
				}
			})
		}
		_getTreeKeys(treeData)
		return treeKeys
	}
	const checkNull = () => {
		setcheckedKeys([])
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
	const getTreeData = () => {
		fetchJson('/permission/allPermissions').then(({ result }) => {
			settreeData(permissionsToTree(result))
		})
		const permissionsToTree = (data: permission[]): DataNode[] =>
			data.map((ele) => ({
				title: ele.name,
				key: ele.id,
				children: ele.children ? permissionsToTree(ele.children) : undefined,
			}))
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
					<Button type='link' onClick={() => onEdit(record)}>
						编辑
					</Button>
					<Button type='link' onClick={() => onAuthorize(record.id)}>
						授权
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
		<Button type='primary' onClick={() => setmodalOpen(true)}>
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
	const footer = (
		<Space>
			<Button type='link' size='small' onClick={checkAll}>
				全选
			</Button>
			<Button type='link' size='small' onClick={checkNull}>
				全不选
			</Button>
		</Space>
	)
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
			<Modal title='用户管理' open={modalOpen} onCancel={closeModal} onOk={submit}>
				<Form labelCol={{ span: 4 }} form={form}>
					<Divider />
					{roleFormItems.map(createFormItem)}
				</Form>
			</Modal>
			<Drawer
				open={drawerOpen}
				title='角色授权'
				width={450}
				onClose={closeDrwaer}
				extra={
					<Button type='primary' onClick={authorize}>
						提交
					</Button>
				}
				footer={footer}
			>
				{treeData.length > 0 && (
					<Tree
						treeData={treeData}
						checkable
						checkStrictly
						defaultExpandAll={true}
						checkedKeys={checkedKeys}
						onCheck={(e: any) => {
							setcheckedKeys(e.checked)
						}}
					/>
				)}
			</Drawer>
		</>
	)
}
