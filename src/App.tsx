import './App.less'
import { CreateFormItem, formItem } from './utils/CreateFormItem'
import { Button, Form } from 'antd'
import Test from './components/Menu'
import NormalLoginForm from './components/LoginForm'
import Particles from './components/Particles'
import './Login.css'
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
	let test = [
		{
			redirect: null,
			path: null,
			component: 'layouts/RouteView',
			route: '1',
			children: [
				{
					path: '/menu',
					component: 'Menu',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'Menu',
						title: '菜单管理',
					},
					name: 'menu',
					id: '1491243913680326658',
					children: [
						{
							path: '/organization132',
							component: 'Organization',
							route: '1',
							meta: {
								keepAlive: false,
								internalOrExternal: false,
								componentName: 'Organization',
								title: '组织管理',
							},
							name: 'organization12',
							id: '14913147174023723318018',
							children: [
								{
									path: '/organization12',
									component: 'Organization',
									route: '1',
									meta: {
										keepAlive: false,
										internalOrExternal: false,
										componentName: 'Organization',
										title: '组织管理',
									},
									name: 'organization12',
									id: '14913147174023723318018',
								},
							],
						},
					],
				},
				{
					path: '/role',
					component: 'Role',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'Role',
						title: '角色管理',
					},
					name: 'role',
					id: '1491244060434829313',
				},
				{
					path: '/user',
					component: 'User',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'User',
						title: '用户管理',
					},
					name: 'user',
					id: '1491244160586420226',
				},
				{
					path: '/organization',
					component: 'Organization',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'Organization',
						title: '组织管理',
					},
					name: 'organization',
					id: '1491314717407318018',
				},
			],
			meta: {
				keepAlive: false,
				internalOrExternal: false,
				icon: 'icon-xitong',
				componentName: 'RouteView',
				title: '系统管理',
			},
			name: null,
			id: '1491243810848575489',
		},
		{
			redirect: null,
			path: null,
			component: 'layouts/RouteView',
			route: '1',
			children: [
				{
					path: '/riskIdentificationManual',
					component: 'RiskIdentificationManual',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'RiskIdentificationManual',
						title: '风险排查手册',
					},
					name: 'riskIdentificationManual',
					id: '1494147166340382721',
				},
				{
					path: '/regulatoryFramework',
					component: 'RegulatoryFramework',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'RegulatoryFramework',
						title: '规章制度',
					},
					name: 'regulatoryFramework',
					id: '1494147387908685826',
				},
				{
					path: '/trainingCourse',
					component: 'TrainingCourse',
					route: '1',
					meta: {
						keepAlive: false,
						internalOrExternal: false,
						componentName: 'TrainingCourse',
						title: '培训课件',
					},
					name: 'trainingCourse',
					id: '1494147656000208898',
				},
			],
			meta: {
				keepAlive: false,
				internalOrExternal: false,
				icon: 'icon-zhishi',
				componentName: 'RouteView',
				title: '知识库',
			},
			name: null,
			id: '1494146760621162497',
		},
	]
	localStorage.setItem('Menu', JSON.stringify(test))
	const menuProps = JSON.parse(localStorage.getItem('Menu') || '[]')

	return (
		<>
			<Particles />
			<div style={{ height: '40px' }}></div>
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
