import { ReactNode } from 'react'
import Login from '../page/NoNavigation/Login'
import { Navigate, Route } from 'react-router-dom'
import Test from '../page/InNavigation/Test'
import Detail from '../page/InNavigation/Detail'
import NoAuth from '../page/InNavigation/NoAuth'
import OrgCodeValid from '../page/NoNavigation/OrgCodeValid'
import User from '../page/InNavigation/sys/User'
import Role from '../page/InNavigation/sys/Role'
//----------------------------------------  ----------------------------------------
interface route {
	path: string
	element: ReactNode
	authFlag?: string
	breadcrumbName: string | null
}
//----------------------------------------  ----------------------------------------
export const NoNavigationRoutes: route[] = [
	{
		path: 'login',
		element: <Login />,
		breadcrumbName: null,
	},
	{
		path: 'orgCodeValid',
		element: <OrgCodeValid />,
		breadcrumbName: null,
	},
]
export const InNavigationRoutes: route[] = [
	//---------------------------------------- sys ----------------------------------------
	{
		path: '/sys',
		element: <Navigate to='/sys/user' />,
		breadcrumbName: '系统管理',
	},
	{
		path: '/sys/user',
		element: <User />,
		breadcrumbName: '用户管理',
	},
	{
		path: '/sys/role',
		element: <Role />,
		breadcrumbName: '角色管理',
	},
	{
		path: 'discoveryItem/detail/:id',
		element: <Detail />,
		breadcrumbName: '发现项详情',
	},
	{
		path: 'checkList',
		element: <Test />,
		breadcrumbName: '检查单列表',
	},
]

export const routesRender = (routes: route[]): ReactNode =>
	routes.map((route) => {
		let { path, element, authFlag } = route
		const auth = Object.keys(JSON.parse(localStorage.getItem('Auth') || '{}'))
		let render = !authFlag || auth.includes(authFlag)
		return render ? (
			<Route key={path} path={path} element={element} />
		) : (
			<Route key={path} path={path} element={<NoAuth aim={route.breadcrumbName || ''} />} />
		)
	})
