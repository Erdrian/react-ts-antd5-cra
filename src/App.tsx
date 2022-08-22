import './App.less'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { NoNavigationRoutes, InNavigationRoutes, routesRender } from './routes/routes'
import Layout from './components/Layout'
import NotFound from './page/InNavigation/NotFound'
import { useEffect } from 'react'
//----------------------------------------  ----------------------------------------
const App = () => {
	const navigate = useNavigate()
	useEffect(() => {
		if (!localStorage.getItem('token')) navigate('/login')
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
