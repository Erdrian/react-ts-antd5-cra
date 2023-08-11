import Particles from '../../components/Particles'
import LoginForm from '../../components/LoginForm'
import { Divider, Space, notification } from 'antd'
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import '../../style/Login.css'
import { useNavigate } from 'react-router-dom'
import logoSrc from '../../assets/logo_black.svg'

const logo = <img alt='logo' src={logoSrc} />
const title = process.env.REACT_APP_NAME
const desc = '用户登录'

export default () => {
	const navigate = useNavigate()
	return (
		<>
			<Particles />
			<div className='login-page-top'>
				<Space split={<Divider type='vertical' />} size={8} align='center'>
					<span className='login-page-top-link'>Contact</span>
					<GithubOutlined />
					<GoogleOutlined />
				</Space>
			</div>
			<div className='content'>
				<div className='form-login-container'>
					<div className='form-login-main'>
						<div className='form-login-top'>
							<div className='form-login-header'>
								<span className='form-login-logo'>{logo}</span>
								<span className='form-login-title'>{title}</span>
							</div>
							<div className='form-login-desc'>{desc}</div>
						</div>
						<LoginForm
							onLogin={(result) => {
								notification.success({
									message: '登录成功',
									description: `欢迎回来，${result.userInfo.realname}`,
									closeIcon: false,
								})
								navigate('/')
							}}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
