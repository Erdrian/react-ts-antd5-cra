/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { createFormItem, formItem } from '../utils/createFormItem'
import { filterInHistory } from './EnquiryForm'
import '../css/SearchForm.css'
import { useLocation } from 'react-router-dom'

type searchFormProps = {
	formItems: formItem[]
	onSearch: Function
	onReset: Function
}

export default ({ formItems, onSearch, onReset }: searchFormProps) => {
	//---------------------------------------- state ----------------------------------------
	const [showmore, setshowmore] = useState(false)
	//---------------------------------------- props ----------------------------------------
	const [form] = Form.useForm()
	const defaultSerachItemsNum = 3
	const location = useLocation()
	const limit = !showmore ? defaultSerachItemsNum - 1 : 99
	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		const state = location.state as filterInHistory
		const filter = state?.filter_history
		if (!filter) return
		if (Object.keys(filter).length === 0) {
			form.resetFields()
		} else {
			form.setFieldsValue(filter)
		}
	})
	if (formItems.length === 0) return <></>
	return (
		<Form
			className={showmore ? 'table-search-form expand' : 'table-search-form shrink'}
			form={form}
			labelCol={{ span: 5 }}
			wrapperCol={{ span: 19 }}
		>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 24, xxl: 16 }}>
				{formItems.length > 0
					? formItems.map((item, index) =>
							index > limit ? (
								''
							) : (
								<Col xs={8} sm={8} md={8} lg={6} xl={6} xxl={6} key={index}>
									{createFormItem(item)}
								</Col>
							)
					  )
					: ''}
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
							form.resetFields()
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
						''
					)}
				</Col>
			</Row>
		</Form>
	)
}
