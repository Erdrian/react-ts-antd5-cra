import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	const navigate = useNavigate()
	return (
		<div>
			<Result
				status='404'
				title='404'
				subTitle='没有权限/访问的页面不存在'
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
