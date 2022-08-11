import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import history from '../routes/history'
import Icon from './Icon'

export interface MenuPropsFromAuth {
	id: string
	path: string | null
	meta: {
		componentName: string
		icon: string | undefined
		title: string
	}
	children?: MenuPropsFromAuth[]
}
type MenuItem = Required<MenuProps>['items'][number]

//创建菜单的方法
const getMenuItems = (child: MenuPropsFromAuth[], subMenukeys?: string[]): MenuItem[] => {
	if (!child) return []
	return child.map((item: MenuPropsFromAuth): MenuItem => {
		let {
			id,
			path,
			meta: { icon, title },
			children,
		} = item
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

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ menuProps }: { menuProps: MenuPropsFromAuth[] }) => {
	//---------------------------------------- props ----------------------------------------
	let pathname = history.location.pathname
	let items = getMenuItems(menuProps)

	//---------------------------------------- state ----------------------------------------
	const [openKeys, setopenKeys] = useState<string[]>([]) //当前展开的subMenu
	const [selectedKeys, setselectedKeys] = useState<string[]>([])
	const [IsMulti, setIsMulti] = useState(false)
	//---------------------------------------- effect ----------------------------------------
	// 自动展开当前路由的菜单
	useEffect(() => {
		let key: string = pathname.slice(1) || ''
		setselectedKeys([key])
		setopenKeys(routeMap[key] || [])
	}, [pathname])
	// 判断菜单是否大于两级
	useEffect(() => {
		Object.entries(routeMap).forEach(([_key, value]) => {
			if (value.length > 1) {
				setIsMulti(true)
			}
		})
	}, [])
	//---------------------------------------- 方法 ----------------------------------------
	//自动收起非当前展开菜单
	const handleOpenKeysChange: MenuProps['onOpenChange'] = (keys) => {
		// 菜单层级大于两级,不再自动收起非当前展开菜单
		if (IsMulti) {
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
	const onClick: MenuProps['onClick'] = (e) => {
		history.push(`/${e.key}`)
		setselectedKeys([e.key])
	}
	return (
		<Menu
			items={items}
			mode='inline'
			theme='dark'
			selectedKeys={selectedKeys}
			onClick={onClick}
			onOpenChange={handleOpenKeysChange}
			openKeys={openKeys}
		></Menu>
	)
}
