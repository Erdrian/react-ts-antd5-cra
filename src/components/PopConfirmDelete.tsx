import { Popconfirm, message, Button } from 'antd'
import { ReactNode } from 'react'
import fetchJson from '../utils/fetch'
//----------------------------------------  ----------------------------------------
type props = {
	api: string
	id: string
	onDeleteOk?: Function
	children?: ReactNode
}
export default (porps: props) => {
	let {
		api,
		id,
		onDeleteOk,
		children = (
			<Button type='link' size='small' danger>
				删除
			</Button>
		),
	} = porps
	return (
		<Popconfirm
			title={`你确定要删除吗？`}
			onConfirm={async () => {
				let { ok } = await fetchJson(api, {
					method: 'POST',
					body: JSON.stringify({ id }),
				})
				if (ok) {
					message.success('操作成功')
					onDeleteOk?.()
				}
			}}
		>
			{children}
		</Popconfirm>
	)
}
