import Particles from '../../components/Particles'
import NormalLoginForm from '../../components/LoginForm'
import './Login.css'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	return (
		<>
			<Particles />
			<div className='login-page-top'></div>
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
