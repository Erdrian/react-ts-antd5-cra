import { useEffect, useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import fetchJson from '../utils/fetch'
import { MenuPropsFromAuth } from './Menu'
import '../style/LoginForm.css'
//---------------------------------------- 类型 ----------------------------------------
interface loginFrom {
	username: string
	password: string
	captcha: string
}
interface loginBody extends loginFrom {
	checkKey: string
	loginKey?: string
}
type areaFromInterface = {
	id: string
	name: string
	level: number
	sortNo: number
	parentId: string
}
type authFromInterface = {
	action: string
	describe: string
	type?: number
}
//获取权限相关
export const getAuth = async () => {
	let { ok, msg, result } = await fetchJson('/sys/permission/getUserPermissionByToken?notJeecg=1')
	if (ok) {
		let { auth, menu }: { auth: authFromInterface[]; menu: MenuPropsFromAuth[] } = result
		if (auth && menu) {
			let authJson = {}
			auth.forEach(({ action, describe }) => {
				authJson[action] = describe
			})
			localStorage.setItem('Auth', JSON.stringify(authJson))
			localStorage.setItem('Menu', JSON.stringify(menu))
		}
	} else {
		message.error(msg)
	}
}
//获取行政区域
export const getAera = async () => {
	let { ok, result } = await fetchJson('/sli/adminDivision/getByParentId?parentId=330200')
	if (ok) {
		let localArea = {}
		result.forEach((item: areaFromInterface) => {
			localArea[item.id] = item.name
		})
		localStorage.setItem('localArea', JSON.stringify(localArea))
	}
}

const LoginForm = ({ size = 'large', onLogin }: { size?: 'large' | 'middle' | 'small'; onLogin?: Function }) => {
	//---------------------------------------- props ----------------------------------------
	const [form] = Form.useForm()
	//---------------------------------------- state ----------------------------------------
	const [captchaKey, setcaptchaKey] = useState('') //获取验证码的key
	const [identify, setIdentify] = useState('') //验证码的图片编码
	const [loginError, setLoginError] = useState('') //登录失败的错误信息
	const [isLoading, setIsloading] = useState(false) //登录请求状态
	//---------------------------------------- effect ----------------------------------------
	// 获取验证码和密码加密码
	useEffect(() => {
		getIdentify()
	}, [])
	// 60s后重新获取验证码和密码加密码
	useEffect(() => {
		let timer_captchaKey: ReturnType<typeof setTimeout> | null = null
		timer_captchaKey = setTimeout(getIdentify, 60000)
		return () => {
			timer_captchaKey && clearTimeout(timer_captchaKey)
		}
	}, [captchaKey])
	//---------------------------------------- 方法 ----------------------------------------
	//登录请求
	const onFinish = async (values: loginFrom) => {
		setIsloading(true)
		let body: loginBody = { ...values, checkKey: captchaKey }
		let { ok, msg, result } = await fetchJson('/sys/login', {
			method: 'post',
			body: JSON.stringify(body),
		})
		setIsloading(false)
		if (!ok) {
			setLoginError(msg)
			getIdentify()
			form.resetFields(['captcha'])
		} else {
			let { token, sysAllDictItems, userInfo } = result
			localStorage.setItem('DictItems', JSON.stringify(sysAllDictItems))
			localStorage.setItem('UserInfo', JSON.stringify(userInfo))
			localStorage.setItem('token', token)
			await getAuth()
			await getAera()
			onLogin?.()
		}
	}

	//获取图形验证码
	const getIdentify = async () => {
		const captchaKey = Math.floor(Math.random() * 1000000).toString() //图形验证码的KEY
		let { ok, result } = await fetchJson('/sys/randomImage/' + captchaKey)
		if (ok) {
			setIdentify(result)
			setcaptchaKey(captchaKey)
		} else {
			message.error('获取验证码失败，请重试')
		}
	}

	return (
		<Form form={form} name='normal_login' className='login-form' onFinish={onFinish} size={size}>
			<Form.Item
				name='username'
				rules={[
					{
						required: true,
						message: '必填',
					},
				]}
			>
				<Input
					prefix={<UserOutlined className='site-form-item-icon' />}
					placeholder='用户名'
					className='login-form-item'
				/>
			</Form.Item>

			<Form.Item
				name='password'
				rules={[
					{
						required: true,
						message: '必填',
					},
				]}
			>
				<Input
					prefix={<LockOutlined className='site-form-item-icon' />}
					type='password'
					placeholder='密码'
					className='login-form-item'
				/>
			</Form.Item>

			<Form.Item>
				<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
					<Form.Item
						style={{
							flexGrow: '1',
						}}
						name='captcha'
						noStyle
						rules={[
							{
								required: true,
								message: '必填',
							},
						]}
					>
						<Input
							className='login-form-item'
							prefix={<SafetyCertificateOutlined className='site-form-item-icon' />}
							placeholder='验证码'
						/>
					</Form.Item>

					<img
						alt='验证码'
						style={{ width: 'auto', height: '39px', cursor: 'pointer' }}
						src={identify}
						onClick={getIdentify}
					/>
				</div>
			</Form.Item>

			<Form.Item>
				<Button
					type='primary'
					htmlType='submit'
					className='login-form-button'
					block
					loading={isLoading}
					size='large'
				>
					登录
				</Button>
			</Form.Item>
			<span
				style={{
					color: 'red',
					fontSize: '12px',
					display: 'block',
					margin: 'auto',
					textAlign: 'center',
				}}
			>
				{loginError}
			</span>
		</Form>
	)
}

export default LoginForm
