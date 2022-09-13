import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
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
	const Items = []
	for (let i = 1; i <= paths.length; i++) {
		let path = paths.slice(0, i).join('/')
		let breadcrumbName = breadcrumbNameMap[path]
		if (breadcrumbName) {
			Items.push(
				<Breadcrumb.Item key={`/${path}`}>
					{i === paths.length ? <span>{breadcrumbName}</span> : <Link to={`/${path}`}>{breadcrumbName}</Link>}
				</Breadcrumb.Item>
			)
		} else {
			let path = paths.slice(0, i - 1).join('/')
			let breadcrumbName = breadcrumbNameMap[path]
			let Item = (
				<Breadcrumb.Item key={`/${path}`}>
					<span>{breadcrumbName}</span>
				</Breadcrumb.Item>
			)
			Items.splice(-1, 1, Item)
			break
		}
	}
	return (
		<Breadcrumb>
			<Breadcrumb.Item key='home'>
				<HomeOutlined />
				<Link to='/'>首页</Link>
			</Breadcrumb.Item>
			{Items}
		</Breadcrumb>
	)
}
