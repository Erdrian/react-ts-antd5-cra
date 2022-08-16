import { ReactNode } from 'react'
import Login from '../page/NoNavigation/Login'
import { Route } from 'react-router-dom'
import Test from '../page/InNavigation/Test'
//----------------------------------------  ----------------------------------------
interface route {
	path: string
	element: ReactNode
	auth_perm?: string
	breadcrumbName?: string
}
//----------------------------------------  ----------------------------------------
export const NoNavigationRoutes: route[] = [
	{
		path: '/login/*',
		element: <Login />,
	},
]
export const InNavigationRoutes: route[] = [
	{
		path: '/discoveryItem',
		element: <Test />,
	},
	{
		path: '/checkList',
		element: <Test />,
	},
]

export const renderRoute = (routes: route[]) => {
	const auth = Object.keys(JSON.parse(localStorage.getItem('Auth') || '{}'))
	let Routes: ReactNode[] = []
	routes.forEach((route) => {
		let { path, element, auth_perm } = route
		if (auth_perm) {
			if (auth.includes(auth_perm)) {
				Routes.push(<Route key={path} path={path} element={element} />)
			}
		} else {
			Routes.push(<Route key={path} path={path} element={element} />)
		}
	})
	return Routes
}
