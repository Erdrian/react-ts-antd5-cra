import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
export default (props: { aim: string }) => {
	const navigate = useNavigate()
	return (
		<div>
			<Result
				status='403'
				title='403'
				subTitle={`没有${props.aim}的访问权限`}
				extra={
					<Button
						type='primary'
						onClick={() => {
							navigate(-1)
						}}
					>
						返回
					</Button>
				}
			/>
		</div>
	)
}
