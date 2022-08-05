// import { useEffect, useState } from 'react'
// import { Menu, MenuProps } from 'antd'
// import { Link } from 'react-router-dom'
// import history from '../utils/history'
// import Icon from './Icon'

// const rootSubmenuKeys: string[] = []
// interface MenuPropsFromAuth {
// 	id: string
// 	path: string | null
// 	meta: {
// 		componentName: string
// 		icon: string | undefined
// 		title: string
// 	}
// 	children?: MenuPropsFromAuth
// }
// type MenuItems = MenuProps['items']

// //创建菜单的方法
// const getMenuItems = (m:MenuPropsFromAuth):MenuItems=>{
// 	if(!m) return []
	
// }
// const createNavigation = (meunuProps:MenuPropsFromAuth) => {
// 	if (!meunuProps) {
// 		return <></>
// 	} else {
// 		return navigations.map((navigation) => {
// 			let { route, id, path, hasChildren } = navigation
// 			if (route === '0') {
// 				return ''
// 			} else {
// 				let paddingLeft = '64px'
// 				let key = path ? path.slice(1) : id
// 				if (key === '') {
// 					key = '/'
// 					paddingLeft = '24px'
// 				}
// 				let { icon, title } = navigation.meta
// 				const Icon = icon ? <Icon type={icon} /> : ''
// 				if (hasChildren) {
// 					// 如果是submenu，则采用id作为key，否则采用path做key
// 					key = id
// 					if (!rootSubmenuKeys.includes(key)) rootSubmenuKeys.push(key)
// 					return (
// 						<Menu.SubMenu key={key} icon={Icon} title={title}>
// 							{createNavigation(navigation.children)}
// 						</Menu.SubMenu>
// 					)
// 				} else {
// 					if (icon) paddingLeft = '24px'
// 					return (
// 						<Menu.Item key={key} icon={Icon} style={{ paddingLeft }}>
// 							<Link to={path}>{title}</Link>
// 						</Menu.Item>
// 					)
// 				}
// 			}
// 		})
// 	}
// }
// const createRouteMap = (arr) => {
// 	let result = {}
// 	let tempArr = []
// 	if (arr) {
// 		arr.forEach((item) => {
// 			if (item.children) {
// 				tempArr = []
// 				item.children.forEach((item) => {
// 					tempArr.push(item.path.slice(1))
// 				})
// 				result[item.id] = tempArr
// 			}
// 		})
// 	}
// 	let finalRes = {}
// 	for (let key in result) {
// 		result[key].forEach((item) => {
// 			finalRes[item] = key
// 		})
// 	}
// 	return finalRes
// }

//导航数组
// const MyMenu = ({ authRoutes }) => {
	// if (!localStorage.getItem('Menu')) {
	// 	Modal.warn({
	// 		title: '登录失效',
	// 		content: '本地缓存数据失效，请重新登录，你可能是首次使用系统或者意外的清除了本地缓存！',
	// 		okText: '重新登录',
	// 		onOk: () => {
	// 			Modal.destroyAll()
	// 			history.push('/login', { from: history.location })
	// 		},
	// 	})
	// }
	// const [authRoutes, setauthRoutes] = useState(JSON.parse(localStorage.getItem('Menu')))
	// useEffect(() => {
	// 	if (!authRoutes || authRoutes.length === 0) setauthRoutes(JSON.parse(localStorage.getItem('Menu')))
	// }, [authRoutes])
	// let path = history.location.pathname.split('/')[1]
	// if (path === '') path = '/'
	// // const routeMap = createRouteMap(authRoutes)
	// const [openKeys, setOpenKeys] = useState(rootSubmenuKeys)
	// const [selectedKeys, setselectedKeys] = useState(path)
	// useEffect(() => {
	// 	setOpenKeys(rootSubmenuKeys)
	// 	setselectedKeys(path)
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [history.location.pathname, authRoutes])

	//自动收起非当前展开菜单
	// const onOpenChange = (keys) => {
	// 	console.log(keys)
	// 	const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
	// 	if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
	// 		setOpenKeys(keys)
	// 	} else {
	// 		setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
	// 	}
	// }

// 	return (
// 		<Menu
// 			mode='inline'
// 			theme='dark'
// 			defaultOpenKeys={openKeys}
// 			// onOpenChange={onOpenChange}
// 			openKeys={openKeys}
// 			selectedKeys={selectedKeys}
// 		>
// 			{createNavigation(authRoutes)}
// 		</Menu>
// 	)
// }

// export default MyMenu
