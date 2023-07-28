import { Popconfirm, message, Button } from 'antd'
import { ReactNode } from 'react'
import fetchJson from '../utils/fetch'
//----------------------------------------  ----------------------------------------
type props = {
	api: string
	id: string | number
	onDeleteOk?: Function
	children?: ReactNode
}
export default (porps: props) => {
	let {
		api,
		id,
		onDeleteOk,
		children = (
			<Button type='link' danger>
				删除
			</Button>
		),
	} = porps
	//----------------------------------------  ----------------------------------------
	const _delete = () => {
		fetchJson(`${api}/${id}`, { method: 'POST' }).then(() => {
			message.success('删除成功')
			onDeleteOk?.()
		})
	}
	return (
		<Popconfirm title={`你确定要删除吗？`} onConfirm={_delete}>
			{children}
		</Popconfirm>
	)
}
