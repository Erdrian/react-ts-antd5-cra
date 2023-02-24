import { Button, Modal, Form } from 'antd'
import { useState } from 'react'
import AMap from '../../components/AMap'
import { createFormItem, formItem } from '../../utils/createFormItem'
export default () => {
	const [open, setopen] = useState(false)
	const handleOpen = () => {
		setopen(true)
	}
	const handleClose = () => {
		setopen(false)
	}
	const formItem: formItem = {
		type: 'slider',
		inputOptions: {
			range: true,
		},
		itemOptions: {
			label: '进度',
			name: 'percent',
			initialValue: [0, 100],
		},
	}
	return (
		<>
			<Button type='primary' onClick={handleOpen}>
				开启地图
			</Button>
			<Modal title='地图' open={open} onCancel={handleClose}>
				<div style={{ height: '600px' }}>
					<AMap />
				</div>
				<Form>{createFormItem(formItem)}</Form>
			</Modal>
		</>
	)
}
