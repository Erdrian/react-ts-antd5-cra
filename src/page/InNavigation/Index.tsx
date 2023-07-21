import AMap from '../../components/AMap'
import fetchJson from '../../utils/fetch'

export default () => {
	fetchJson('/user/list?username=ad&page=1').then(({ ok, result }) => console.log(result))
	return <AMap />
}
