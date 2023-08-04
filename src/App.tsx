import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NoNavigationRoutes, InNavigationRoutes, routesRender } from './routes/routes'
import Layout from './components/Layout'
import NotFound from './page/InNavigation/NotFound'
import { useEffect } from 'react'
import 'antd/dist/reset.css'
import './App.css'
import { getBreadcrumbNameMap } from './components/Breadcrumb'
//----------------------------------------  ----------------------------------------
const App = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		if (!localStorage.getItem('token') && pathname !== '/login') navigate('/login')
	}, [pathname])

	useEffect(() => {
		let breadcrumbNameMap = getBreadcrumbNameMap()
		if (pathname === '/') {
			document.title = breadcrumbNameMap[''] || process.env.REACT_APP_NAME
			return
		}
		let paths = pathname.split('/').filter((i) => i)
		let items = []
		for (let i = 1; i <= paths.length; i++) {
			let path = paths.slice(0, i).join('/')
			let title = breadcrumbNameMap[path]
			if (title) {
				items.push({ path: `/${path}`, title })
			}
		}
		let title = items[items.length - 1]?.title || process.env.REACT_APP_NAME
		document.title = title
	}, [pathname])

	useEffect(() => {
		localStorage.getItem('URLCACHE') && localStorage.removeItem('URLCACHE')
		localStorage.getItem('loginModalExist') && localStorage.removeItem('loginModalExist')
	}, [])
	return (
		<>
			<Routes>
				{routesRender(NoNavigationRoutes)}
				<Route element={<Layout />}>
					{routesRender(InNavigationRoutes)}
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</>
	)
}
export default App
