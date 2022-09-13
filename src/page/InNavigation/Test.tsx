import { useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import fetchJson from '../../utils/fetch'
export default () => {
	useEffect(() => {
		//获取所有角色
		const getAllRole = async () => {
			await fetchJson('/sys/role/list?pageNo=1&pageSize=100')
		}
		getAllRole()
	}, [])
	return (
		<>
			<PageHeader />
		</>
	)
}
