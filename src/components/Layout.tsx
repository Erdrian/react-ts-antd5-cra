import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Layout, Menu, message, Modal, Space } from 'antd'
import { useState, createElement } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Mymenu from './Menu'
import '../css/Layout.css'
import fetchJson from '../utils/fetch'
//----------------------------------------  ----------------------------------------
const UserMenu = () => {
	const navigate = useNavigate()
	//---------------------------------------- state ----------------------------------------
	const [visible, setvisible] = useState(false)
	//---------------------------------------- 方法 ----------------------------------------
	const loginOut = async () => {
		let { ok } = await fetchJson('/sys/logout')
		if (ok) {
			localStorage.removeItem('token')
			navigate('/login')
			message.success('您已退出登录')
		}
	}
	return (
		<>
			<Modal visible={visible}></Modal>
			<Menu className='avatardropdown'>
				<Menu.Item
					key='1'
					onClick={() => {
						setvisible(true)
					}}
				>
					<SettingOutlined /> 密码修改
				</Menu.Item>
				<Menu.Item danger key='2' onClick={loginOut}>
					<LogoutOutlined /> 退出登录
				</Menu.Item>
			</Menu>
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
					<Icon type='icon-fengkong' className='logo-icon' />
					<span className='logo-title'>安责险风控系统</span>
				</div>
				<Mymenu menuProps={menuProps} />
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
