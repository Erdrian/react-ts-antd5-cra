import './App.less'
// import { Button, Empty, Form, Input, Upload } from 'antd'
// import { CreateFormItem, formItem } from './utils/CreateFormItem'
// import { useRef } from 'react'
// const normFile = (e: any) => {
// 	if (Array.isArray(e)) {
// 		return e
// 	}
// 	return e && e.fileList
// }

function App() {
	localStorage.setItem(
		'token',
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTk1MTk0MzcsInVzZXJuYW1lIjoiYWRtaW5pc3RyYXRvciJ9.VImMgu6h9CLXxz_6S5umDfCo-NxnXFCYL0Y-Ef3GxMo'
	)

	return (
		<>
			HelloWorld
		</>
	)
}
export default App
