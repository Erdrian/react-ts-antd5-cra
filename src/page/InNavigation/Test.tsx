import { Button, Modal } from 'antd'
import { useState } from 'react'

import AMap from '../../components/AMap'
export default () => {
	const [open, setopen] = useState(false)
	const handleOpen = () => {
		setopen(true)
	}
	const handleClose = () => {
		setopen(false)
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
			</Modal>
		</>
	)
}
