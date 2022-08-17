import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Form, Layout, Menu, MenuProps, message, Modal, Space } from 'antd'
import { useState, createElement } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Mymenu from './Menu'
import '../css/Layout.css'
import fetchJson from '../utils/fetch'
import { createFormItem, formItem } from '../utils/createFormItem'
import { password } from '../utils/regexp'
//----------------------------------------  ----------------------------------------
// 用户头像下拉菜单|用户修改密码
const UserMenu = () => {
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const items: Required<MenuProps>['items'] = [
		{
			key: 'passedit',
			label: '密码修改',
			icon: <SettingOutlined />,
			onClick: () => {
				setvisible(true)
			},
		},
		{
			key: 'loginout',
			label: '退出登录',
			icon: <LogoutOutlined />,
			onClick: loginOut,
			danger: true,
		},
	]
	const formItems: formItem[] = [
		{
			type: 'password',
			itemOptions: {
				label: '旧密码',
				name: 'oldpassword',
				rules: [
					{
						required: true,
						message: '确认你的新密码',
					},
				],
			},
			inputOptions: {
				placeholder: '请输入旧密码',
			},
		},
		{
			type: 'password',
			itemOptions: {
				label: '新密码',
				name: 'password',
				rules: [
					{
						required: true,
						message: '输入你的新密码',
					},
					() => ({
						validator(_, value) {
							const regexp = new RegExp(password)
							if (regexp.test(value)) {
								return Promise.resolve()
							}
							return Promise.reject(new Error('密码8-16位，至少包含大写字母，小写字母和数字'))
						},
					}),
				],
				hasFeedback: true,
			},
			inputOptions: {
				placeholder: '8-16位，至少包含大写字母，小写字母和数字',
			},
		},
		{
			type: 'password',
			itemOptions: {
				label: '确认密码',
				name: 'confirmpassword',
				dependencies: ['password'],
				rules: [
					{
						required: true,
						message: '确认你的新密码',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve()
							}
							return Promise.reject(new Error('两次输入的密码不一致'))
						},
					}),
				],
				hasFeedback: true,
			},
			inputOptions: {
				placeholder: '重复你的密码',
			},
		},
	]
	//---------------------------------------- state ----------------------------------------
	const [visible, setvisible] = useState(false)
	//---------------------------------------- 方法 ----------------------------------------
	async function loginOut() {
		let { ok } = await fetchJson('/sys/logout')
		if (ok) {
			localStorage.removeItem('token')
			navigate('/login')
			message.success('您已退出登录')
		}
	}
	const submit = () => {
		form.validateFields().then(async (value) => {
			let { username } = JSON.parse(localStorage.getItem('UserInfo') || '{}')
			let { ok } = await fetchJson('/sys/user/updatePassword', {
				method: 'PUT',
				body: JSON.stringify({ ...value, username }),
			})
			if (ok) {
				setvisible(false)
				message.success('密码修改成功')
			}
		})
	}
	const onCancel = () => {
		setvisible(false)
	}
	return (
		<>
			<Modal title='修改密码' visible={visible} onOk={submit} onCancel={onCancel} destroyOnClose>
				<Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form} preserve={false}>
					{formItems.map((formItem, i) => createFormItem(formItem, i))}
				</Form>
			</Modal>
			<Menu className='avatardropdown' items={items} />
		</>
	)
}
const HeaderRight = () => {
	//---------------------------------------- props ----------------------------------------
	const userInfo = JSON.parse(localStorage.getItem('UserInfo') || '{}')
	return (
		<Space size='small' className='layout-header-right'>
			<Dropdown overlay={UserMenu()} placement='bottomLeft'>
				<div>
					<Avatar size={36} src={userInfo.avatar || ''} className='user-avatar' />
					<span className='user-name'>{userInfo.realname || null}</span>
				</div>
			</Dropdown>
		</Space>
	)
}
export default () => {
	//---------------------------------------- props ----------------------------------------
	const { Header, Sider, Content } = Layout
	const menuProps = JSON.parse(localStorage.getItem('Menu') || '[]')
	const navigate = useNavigate()
	const logo = <Icon type='icon-fengkong' className='logo-icon' />
	const title = '安责险风控系统'
	//---------------------------------------- state ----------------------------------------
	const [collapsed, setcollapased] = useState(false)
	return (
		<Layout style={{ minHeight: '100vh', minWidth: '1200px' }}>
			<Sider trigger={null} collapsible collapsed={collapsed} width={250}>
				<div
					className='logo'
					onClick={() => {
						navigate('/')
					}}
				>
					{logo}
					<span className='logo-title'>{title}</span>
				</div>
				<Mymenu menuProps={menuProps} collapsed={collapsed} />
			</Sider>
			<Layout className='site-layout'>
				<Header className='site-layout-background'>
					{createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
						className: 'trigger',
						onClick: () => {
							setcollapased(!collapsed)
						},
					})}
					<HeaderRight />
				</Header>
				<Content>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
