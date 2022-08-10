import Particles from '../../components/Particles'
import NormalLoginForm from '../../components/LoginForm'
import { Divider, Space } from 'antd'
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons'
import './Login.css'

const logo = <img alt='logo' src='logo.svg' />
const title = '安责险风控平台'
const desc = '用户登录'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
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
						<NormalLoginForm />
					</div>
				</div>
			</div>
		</>
	)
}
