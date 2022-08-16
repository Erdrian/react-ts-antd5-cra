import './App.less'
import { Route, Routes } from 'react-router-dom'
import { NoNavigationRoutes, InNavigationRoutes, renderRoute } from './routes/routes'
import Layout from './components/Layout'
import NotFound from './page/NoNavigation/NotFound'
//----------------------------------------  ----------------------------------------
const App = () => {
	return (
		<>
			<Routes>
				{renderRoute(NoNavigationRoutes)}
				<Route element={<Layout />}>
					{renderRoute(InNavigationRoutes)}
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</>
	)
}
export default App
