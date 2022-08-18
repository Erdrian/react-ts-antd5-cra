import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb'
import fetchJson from '../../utils/fetch'
export default () => {
	const navigate = useNavigate()
	useEffect(() => {
		//获取所有角色
		const getAllRole = async () => {
			await fetchJson('/sys/role/list?pageNo=1&pageSize=100')
		}
		getAllRole()
	}, [])
	return (
		<>
		<Breadcrumb/>
			<button
				onClick={() => {
					navigate('detail/1234')
				}}
			>
				登录
			</button>
		</>
	)
}
