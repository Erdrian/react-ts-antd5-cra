import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import Icon from './Icon'
import { useLocation, useNavigate } from 'react-router-dom'

export interface MenuPropsFromAuth {
	id: string
	path: string | null
	icon?: string
	title: string
	children?: MenuPropsFromAuth[]
}
type MenuItem = Required<MenuProps>['items'][number]

//创建菜单的方法
const getMenuItems = (child: MenuPropsFromAuth[], subMenukeys?: string[]): MenuItem[] => {
	if (!child) return []
	return child.map((item: MenuPropsFromAuth): MenuItem => {
		let { id, path, icon, title, children } = item
		let key = path ? path.slice(1) : id
		let ICON = icon ? <Icon type={icon} /> : undefined
		let parentKeys: string[] = subMenukeys || []
		if (children) {
			let tempParentKeys = [...parentKeys]
			tempParentKeys.push(key)
			if (!rootSubmenuKeys.includes(key)) rootSubmenuKeys.push(key)
			return {
				key,
				label: title,
				icon: ICON,
				children: getMenuItems(children, tempParentKeys),
			}
		} else {
			routeMap[key] = parentKeys
			return {
				key,
				label: title,
				icon: ICON,
			}
		}
	})
}
let routeMap: { [key: string]: string[] } = {}
let rootSubmenuKeys: string[] = []

export default ({ menuProps, collapsed }: { menuProps: MenuPropsFromAuth[]; collapsed?: boolean }) => {
	//---------------------------------------- props ----------------------------------------
	const navigate = useNavigate()
	const location = useLocation()
	let pathname = location.pathname
	//---------------------------------------- state ----------------------------------------
	const [openKeys, setopenKeys] = useState<string[]>([]) //当前展开的subMenu
	const [selectedKeys, setselectedKeys] = useState<string[]>([])
	//---------------------------------------- effect ----------------------------------------
	// 自动展开当前路由的菜单
	useEffect(() => {
		let key: string =
			pathname
				.split('/')
				.filter((i: any) => i)
				.join('/') || '/'
		setselectedKeys([key])
		setopenKeys(routeMap[key] || [])
	}, [pathname, collapsed])

	//---------------------------------------- 方法 ----------------------------------------
	//自动收起非当前展开菜单
	const handleOpenKeysChange: MenuProps['onOpenChange'] = (keys) => {
		// 菜单层级大于两级,不再自动收起非当前展开菜单
		if (isMulti()) {
			setopenKeys(keys)
		} else {
			const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1) || ''
			if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
				setopenKeys(keys)
			} else {
				setopenKeys([latestOpenKey])
			}
		}
	}
	// 判断菜单层级是否大于两级
	const isMulti = () => Object.entries(routeMap).some(([key, value]) => value.length > 1)
	const onClick: MenuProps['onClick'] = (e) => {
		navigate(`/${e.key}`)
		setselectedKeys([e.key])
	}
	return (
		<Menu
			items={getMenuItems(menuProps)}
			mode='inline'
			theme='dark'
			selectedKeys={selectedKeys}
			onClick={onClick}
			onOpenChange={handleOpenKeysChange}
			openKeys={openKeys}
		/>
	)
}
