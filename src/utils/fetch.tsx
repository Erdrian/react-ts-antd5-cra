import { Col, message, Modal, Row } from 'antd'
import LoginForm from '../components/LoginForm'
import '../css/LoginModal.css'
import errorSvg from '../assets/401.svg'
//----------------------------------------  ----------------------------------------
// export const BASE: string = 'http://localhost:8080'
export const BASE = 'https://devsli.nbmydigit.com/api'

export default async function fetchJson(URL: string, options?: RequestInit) {
	const createLoginModal = () => {
		localStorage.setItem('loginModalExist', 'true')
		Modal.info({
			icon: null,
			width: 650,
			okButtonProps: { style: { display: 'none' } },
			content: (
				<Row>
					<Col span={12}>
						<div className='login-modal-content'>
							<img className='login-modal-img' alt='401' src={errorSvg} />
							<div className='login-modal-title'>登录失效</div>
							<div className='login-modal-subtitle'>Token失效，请重新登录</div>
						</div>
					</Col>
					<Col span={12}>
						<LoginForm
							size='middle'
							onLogin={() => {
								Modal.destroyAll()
								message.success('登录成功')
								localStorage.removeItem('loginModalExist')
								window.location.reload()
							}}
						/>
					</Col>
				</Row>
			),
		})
	}
	const path = window.location.pathname
	const token: string = localStorage.getItem('token') || ''
	const headers = options?.headers
	try {
		let defaultHeaders = { 'X-Access-Token': token, 'Content-Type': 'application/json; charset=UTF-8' }
		if (headers) {
			defaultHeaders = { ...defaultHeaders, ...headers }
		}
		let Options: RequestInit = { ...options, headers: { ...defaultHeaders } }
		let res = await fetch(BASE + URL, Options)
		let {
			success: ok,
			message: msg,
			result,
			code,
			timestamp,
		} = (await res.json()) || {
			success: false,
			message: '数据解析失败',
			result: null,
		}
		if (code === 401) {
			if (path !== '/login' && token && !(localStorage.getItem('loginModalExist') === 'true')) {
				createLoginModal()
			}
			return { ok: false }
		}
		if (!ok) {
			message.error(msg)
		}
		return { ok, result, msg, code, timestamp }
	} catch (e) {
		message.error('服务器连接失败，请稍后再试')
		console.log(e)
		return { ok: false, message: '服务器连接失败', result: null }
	}
}
