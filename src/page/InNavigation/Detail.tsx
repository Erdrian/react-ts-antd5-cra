import { useLocation } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb'

export default () => {
	const location = useLocation()
	console.log(location.pathname.split('/').filter((i) => i))
	return <Breadcrumb />
}
