import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb, BreadcrumbProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { InNavigationRoutes } from '../routes/routes'
//----------------------------------------  ----------------------------------------

export const getBreadcrumbNameMap = () => {
	// 将/path/:id之类的路径转换为/path这样的路径
	const pathWithoutParams = (path: string): string => {
		let paths = path.split('/').filter((i) => i && i.indexOf(':') === -1)
		return paths.join('/')
	}
	let result = {}
	InNavigationRoutes.forEach((route) => {
		let { path, breadcrumbName } = route
		if (breadcrumbName) {
			result[pathWithoutParams(path)] = breadcrumbName
		}
	})
	return result
}
//----------------------------------------  ----------------------------------------
export default () => {
	const breadcrumbNameMap = getBreadcrumbNameMap()
	const { pathname } = useLocation()
	const paths = pathname.split('/').filter((i) => i)
//----------------------------------------  ----------------------------------------
	const getItems = () => {
		let items = [
			{
				title: (
					<>
						<HomeOutlined />
						<span style={{ marginLeft: '4px' }}>首页</span>
					</>
				),
				path: '/',
			},
		]
		for (let i = 1; i <= paths.length; i++) {
			let path = paths.slice(0, i).join('/')
			let title = breadcrumbNameMap[path]
			if (title) {
				items.push({ path: `/${path}`, title })
			} else {
				path = paths.slice(0, i - 1).join('/')
				title = breadcrumbNameMap[path]
				let item = { path: `/${path}`, title }
				items.splice(-1, 1, item)
				break
			}
		}
		return items
	}
	const itemRender: BreadcrumbProps['itemRender'] = (item, params, items, paths) => {
		const last = items.indexOf(item) === items.length - 1
		return last ? <span>{item.title}</span> : <Link to={item.path || '404'}>{item.title}</Link>
	}
	return <Breadcrumb items={getItems()} itemRender={itemRender} />
}
