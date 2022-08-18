import './App.less'
import { Route, Routes } from 'react-router-dom'
import { NoNavigationRoutes, InNavigationRoutes, routesRender } from './routes/routes'
import Layout from './components/Layout'
import NotFound from './page/InNavigation/NotFound'
//----------------------------------------  ----------------------------------------
const App = () => {
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
