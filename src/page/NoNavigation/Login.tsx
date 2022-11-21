import Particles from '../../components/Particles'
import LoginForm from '../../components/LoginForm'
import { Divider, Space } from 'antd'
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import '../../style/Login.css'
import { useNavigate } from 'react-router-dom'
import logoSrc from '../../assets/logo.svg'

const logo = <img alt='logo' src={logoSrc} />
const title = '安责险风控平台'
const desc = '用户登录'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	const navigate = useNavigate()
	return (
		<>
			<Particles />
			<div className='login-page-top'>
				<Space split={<Divider type='vertical' />} size={8} align='center'>
					<span className='login-page-top-link'>Contact</span>
					<GithubOutlined style={{ fontSize: '20px' }} />
					<GoogleOutlined style={{ fontSize: '20px' }} />
				</Space>
			</div>
			<div className='content'>
				<div className='form-login-container'>
					<div className='form-login-top'>
						<div className='form-login-header'>
							<span className='form-login-logo'>{logo}</span>
							<span className='form-login-title'>{title}</span>
						</div>
						<div className='form-login-desc'>{desc}</div>
					</div>
					<div className='form-login-main'>
						<LoginForm
							onLogin={() => {
								navigate('/')
							}}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
