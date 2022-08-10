import './App.less'
import { GithubOutlined } from '@ant-design/icons'
import NormalLoginForm from './components/LoginForm'
import Particles from './components/Particles'
import './page/NoNavigation/Login.css'
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
			<Particles />
			<div className='login-page-top'>
				<GithubOutlined />
			</div>
			<div className='content'>
				<div className='form-login-container'>
					<div className='form-login-top'>
						<div className='form-login-header'>
							<span className='form-login-logo'>
								<img alt='logo' src='logo.svg' />
							</span>
							<span className='form-login-title'>安责险风控平台</span>
						</div>
						<div className='form-login-desc'>用户登录</div>
					</div>
					<div className='form-login-main'>
						<NormalLoginForm />
					</div>
				</div>
			</div>
		</>
	)
}
export default App
