/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { createFormItem, formItem } from '../utils/createFormItem'
import '../style/SearchForm.css'

type searchFormProps = {
	formItems: formItem[]
	onSearch: Function
	onReset: Function
	value: any
}

export default ({ formItems, onSearch, onReset, value }: searchFormProps) => {
	if (formItems.length === 0) return <></>
	//---------------------------------------- state ----------------------------------------
	const [showmore, setshowmore] = useState(false)
	//---------------------------------------- props ----------------------------------------
	const [form] = Form.useForm()
	const defaultSerachItemsNum = 3
	const limit = !showmore ? defaultSerachItemsNum - 1 : 99
	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		form.resetFields()
		form.setFieldsValue(value)
	}, [value])
	return (
		<Form className='table-search-form' form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 24, xxl: 16 }}>
				{formItems.map(
					(item, index) =>
						index < limit && (
							<Col xs={8} sm={8} md={8} lg={6} xl={6} xxl={6} key={index}>
								{createFormItem(item)}
							</Col>
						)
				)}
				<Col className='table-search-action'>
					<Button
						type='primary'
						style={{ marginRight: '8px' }}
						onClick={() => onSearch(form.getFieldsValue(true))}
					>
						查询
					</Button>
					<Button
						onClick={() => {
							setshowmore(false)
							onReset()
						}}
					>
						重置
					</Button>
					{formItems.length > defaultSerachItemsNum ? (
						<a
							style={{ fontSize: 12, marginLeft: '8px' }}
							onClick={() => {
								setshowmore(!showmore)
							}}
						>
							{showmore ? <UpOutlined /> : <DownOutlined />} {showmore ? '收起' : '更多'}
						</a>
					) : (
						<></>
					)}
				</Col>
			</Row>
		</Form>
	)
}
