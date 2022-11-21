import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NoNavigationRoutes, InNavigationRoutes, routesRender } from './routes/routes'
import Layout from './components/Layout'
import NotFound from './page/InNavigation/NotFound'
import { useEffect } from 'react'
import 'antd/dist/reset.css'
import './App.css'
//----------------------------------------  ----------------------------------------
const App = () => {
	const navigate = useNavigate()
	const location = useLocation()
	useEffect(() => {
		let path = location.pathname
		if (!localStorage.getItem('token') && path !== '/login') navigate('/login')
	}, [])
	useEffect(() => {
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
