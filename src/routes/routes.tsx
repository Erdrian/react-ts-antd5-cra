import { Fragment, ReactNode } from 'react'
import Login from '../page/NoNavigation/Login'
import { Route } from 'react-router-dom'
import Test from '../page/InNavigation/Test'
import Detail from '../page/InNavigation/Detail'
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
]
export const InNavigationRoutes: route[] = [
	{
		path: 'discoveryItem',
		element: <Test />,
		breadcrumbName: '发现项列表',
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
		return render ? <Route key={path} path={path} element={element} /> : <Fragment key={path}></Fragment>
	})
