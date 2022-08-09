import { useEffect, useState } from 'react'
import { JSEncrypt } from 'jsencrypt'
import history from '../utils/history'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import fetchJson from '../utils/fetch'
import { MenuPropsFromAuth } from './Menu'
import './LoginForm.css'
//----------------------------------------  ----------------------------------------
//获取权限相关
export const getAuth = async () => {
	type authFromInterface = {
		action: string
		describe: string
		type?: number
	}
	let { ok, msg, result } = await fetchJson('/sys/permission/getUserPermissionByToken?notJeecg=1')
	if (ok) {
		let { auth, menu }: { auth: authFromInterface[]; menu: MenuPropsFromAuth[] } = result
		if (auth && menu) {
			let authJson: { [key: string]: any } = {}
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
	type areaFromServer = {
		id: string
		name: string
		level: number
		sortNo: number
		parentId: string
	}
	let { ok, result } = await fetchJson('/sli/adminDivision/getByParentId?parentId=330200')
	if (ok) {
		let localArea = {}
		result.forEach((item: areaFromServer) => {
			localArea[item.id] = item.name
		})
		localStorage.setItem('localArea', JSON.stringify(localArea))
	}
}
const EncryptAble = false
const NormalLoginForm = () => {
	//---------------------------------------- props ----------------------------------------
	const [form] = Form.useForm()
	const state = history.location.state as { from: string } | undefined
	let to = state?.from || '/'
	//---------------------------------------- state ----------------------------------------
	const [captchaKey, setcaptchaKey] = useState('') //获取验证码的key
	const [encryptKey, setencryptKey] = useState('') //加密对应的key
	const [publicKey, setpublicKey] = useState('') //密码加密公钥
	const [identify, setIdentify] = useState('') //验证码的图片编码
	const [loginError, setLoginError] = useState('') //登录失败的错误信息
	const [isLoading, setIsloading] = useState(false) //登录请求状态
	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		getIdentify()
		getKey()
		let timer_captchaKey: ReturnType<typeof setTimeout> | null = null
		let timer_encryptKey: ReturnType<typeof setTimeout> | null = null

		timer_captchaKey = setTimeout(() => {
			getIdentify()
		}, 60000)
		if (EncryptAble) {
			timer_encryptKey = setTimeout(() => {
				getKey()
			}, 600000)
		}
		return () => {
			timer_captchaKey && clearTimeout(timer_captchaKey)
			timer_encryptKey && clearTimeout(timer_encryptKey)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	//---------------------------------------- 方法 ----------------------------------------
	//登录请求
	const onFinish = async (values: { username: string; password: string; captcha: string }) => {
		setIsloading(true)
		let { password } = values
		let pass = EncryptAble ? encrypt(publicKey, password) : password
		let { ok, msg, result } = await fetchJson('/sys/login', {
			method: 'post',
			body: JSON.stringify({ ...values, captchaKey, password: pass, encryptKey }),
		})
		setIsloading(false)
		if (!ok) {
			if (msg === '登录key失效') {
				await getKey()
				onFinish(values)
			} else {
				setLoginError(msg)
				getIdentify()
				getKey()
				form.resetFields(['captcha'])
			}
		} else {
			let { token, sysAllDictItems, userInfo } = result
			localStorage.setItem('DictItems', JSON.stringify(sysAllDictItems))
			localStorage.setItem('UserInfo', JSON.stringify(userInfo))
			localStorage.setItem('token', token)
			await getAuth()
			await getAera()
			if (to === '/login') to = '/'
			history.push(to)
		}
	}

	//获取图形验证码
	const getIdentify = async () => {
		const captchaKey = Math.floor(Math.random() * 1000000).toString() //图形验证码的KEY
		try {
			let { ok, result } = await fetchJson('/sys/randomImage/' + captchaKey)
			if (ok) {
				setIdentify(result)
				setcaptchaKey(captchaKey)
			} else {
				message.error('获取验证码失败，请重试')
			}
		} catch (e) {
			message.error('服务器连接失败，请稍后重试')
		}
	}

	//获取加密公钥
	const getKey = async () => {
		if (!EncryptAble) return
		try {
			let { ok, result } = await fetchJson('/sys/getLoginPublicKey')
			if (ok) {
				let { encryptKey, publicKey } = result
				setencryptKey(encryptKey)
				setpublicKey(publicKey)
			} else {
				message.error('获取公钥失败，请刷新页面')
			}
		} catch (e) {
			message.error('服务器连接失败，请稍后重试')
		}
	}

	//加密
	const encrypt = (publicKey: string, password: string) => {
		let encryptor = new JSEncrypt()
		encryptor.setPublicKey(publicKey)
		return encryptor.encrypt(password)
	}

	return (
		<Form
			form={form}
			name='normal_login'
			className='login-form'
			onFinish={onFinish}
			style={{ width: '100%', marginTop: '20px' }}
			size='large'
		>
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
						style={{ width: 'auto', height: '40px', cursor: 'pointer' }}
						src={identify}
						onClick={() => getIdentify()}
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

export default NormalLoginForm
