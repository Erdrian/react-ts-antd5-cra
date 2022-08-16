import { useNavigate } from 'react-router-dom'
export default () => {
	const navigate = useNavigate()
	console.log('渲染了');
	
	return (
		<button
			onClick={() => {
				navigate('/login')
			}}
		>
			登录
		</button>
	)
}
