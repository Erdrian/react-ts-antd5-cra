import { ReactNode } from 'react'
import Login from '../page/NoNavigation/Login'
import { Navigate, Route } from 'react-router-dom'
import NoAuth from '../page/InNavigation/NoAuth'
import OrgCodeValid from '../page/NoNavigation/OrgCodeValid'
import User from '../page/InNavigation/sys/User'
import Role from '../page/InNavigation/sys/Role'
import Permission from '../page/InNavigation/sys/Permission'
import Index from '../page/InNavigation/Index'
//----------------------------------------  ----------------------------------------
interface route {
	path: string
	element: ReactNode
	authority?: string
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
	{
		path: '/',
		element: <Index />,
		breadcrumbName: '首页',
	},
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
		authority: 'permission:user-list',
	},
	{
		path: '/sys/role',
		element: <Role />,
		breadcrumbName: '角色管理',
		authority: 'permission:role-list',
	},
	{
		path: '/sys/permission',
		element: <Permission />,
		breadcrumbName: '权限管理',
		authority: 'permission:permission-list',
	},
]

export const routesRender = (routes: route[]): ReactNode =>
	routes.map((route) => {
		let { path, element, authority: authFlag } = route
		const auth = JSON.parse(localStorage.getItem('Authorizes') || '[]')
		let render = !authFlag || auth.includes(authFlag)
		return render ? (
			<Route key={path} path={path} element={element} />
		) : (
			<Route key={path} path={path} element={<NoAuth aim={route.breadcrumbName || ''} />} />
		)
	})
