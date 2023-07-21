import { Button, Divider, Form, Modal, Space, Table, TableProps, message } from 'antd'
import { createFormItem, formItem } from '../utils/createFormItem'
import { useEffect, useState } from 'react'
import { FormInstance } from 'antd/lib/form/Form'
import { PlusCircleOutlined } from '@ant-design/icons'

export type FormTableProps = {
	value?: []
	onChange?: Function
	getFormItems: (form?: FormInstance) => formItem[]
	style?: React.CSSProperties
}
export default ({ onChange, getFormItems, value = [] }: FormTableProps) => {
	const [form] = Form.useForm()
	//----------------------------------------  ----------------------------------------
	const [data, setdata] = useState<{ key: string }[]>([])
	const [open, setopen] = useState(false)
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		if (data.length !== value.length) {
			setdata(value)
		}
	}, [value])
	//----------------------------------------  ----------------------------------------
	const createKey = () => new Date().getTime().toString()
	const deleteCol = (key: string) => {
		let index = data.findIndex((ele) => {
			return ele.key === key
		})
		if (index > -1) {
			let _data = [...data]
			_data.splice(index, 1)
			message.success('删除成功')
			setdata(_data)
			onChange?.(_data)
		} else {
			message.error('未找到对应数据')
		}
	}
	const closeModal = () => {
		setopen(false)
		form.resetFields()
	}
	const submit = () => {
		form.validateFields().then((values) => {
			let _data = [...data, { ...values, key: createKey() }]
			closeModal()
			setdata(_data)
			onChange?.(_data)
		})
	}
	//----------------------------------------  ----------------------------------------
	const columns: TableProps<any>['columns'] = [
		...getFormItems()
			.filter((ele) => !!ele.itemOptions.name && ele.itemOptions.name !== 'id')
			.map(({ itemOptions: { name, label } }) => {
				return { dataIndex: name, title: label }
			}),
		{
			title: '操作',
			render: (_, record) => (
				<Space>
					<Button type='link' danger onClick={() => deleteCol(record.key)}>
						删除
					</Button>
				</Space>
			),
		},
	]
	const footer: TableProps<any>['footer'] = () => (
		<Button type='dashed' block onClick={() => setopen(true)} icon={<PlusCircleOutlined />}>
			新增
		</Button>
	)
	return (
		<>
			<Table columns={columns} dataSource={data} size='small' bordered footer={footer} pagination={false} />
			<Modal title='数据管理' open={open} onOk={submit} onCancel={closeModal}>
				<Form form={form} layout='vertical'>
					<Divider />
					{getFormItems(form).map(createFormItem)}
				</Form>
			</Modal>
		</>
	)
}
