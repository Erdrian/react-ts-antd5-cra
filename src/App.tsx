import './App.less'
import { CreateFormItem, formItem } from './utils/CreateFormItem'
import { Button, Form } from 'antd'
// import { CreateFormItem, formItem } from './utils/CreateFormItem'
// import { useRef } from 'react'
// const normFile = (e: any) => {
// 	if (Array.isArray(e)) {
// 		return e
// 	}
// 	return e && e.fileList
// }

function App() {
	const [form] = Form.useForm()
	const formItem: formItem = {
		type: 'inputNumber',
		inputOptions: { addonAfter: '元' },
		itemOptions: { name: 'test', label: '测试' },
	}
	localStorage.setItem(
		'token',
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTk1MTk0MzcsInVzZXJuYW1lIjoiYWRtaW5pc3RyYXRvciJ9.VImMgu6h9CLXxz_6S5umDfCo-NxnXFCYL0Y-Ef3GxMo'
	)
	return (
		<>
			<Form form={form}>{CreateFormItem(formItem)}</Form>
			<Button
				onClick={() => {
					console.log(form.getFieldsValue())
				}}
			>
				1
			</Button>
		</>
	)
}
export default App
