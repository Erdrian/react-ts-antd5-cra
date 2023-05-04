import { Button, Modal, Form, Timeline } from 'antd'
import { useRef, useState } from 'react'
import AMap from '../../components/AMap'
import { createFormItem, formItem } from '../../utils/createFormItem'
import Upload from '../../components/Upload'
export default () => {
	const [open, setopen] = useState(false)
	const [form] = Form.useForm()
	const file = useRef<any>()
	const handleOpen = () => {
		setopen(true)
	}
	const handleClose = () => {
		console.log(file.current.value)

		setopen(false)
	}
	const formItem: formItem = {
		type: 'upload',
		inputOptions: {
			valueFormatter: (file) => ({ file: file.name }),
		},
		itemOptions: {
			label: '进度',
			name: 'percent',
		},
	}
	return (
		<>
			<Form>
				<Form.Item name='test' initialValue={[{ fileId: '12', fileTitle: '1234' }]}>
					<Upload />
				</Form.Item>
			</Form>

			<Button type='primary' onClick={handleOpen}>
				开启地图
			</Button>
			<Modal
				title='地图'
				open={open}
				onCancel={handleClose}
				okButtonProps={{
					onClick() {
						console.log(file.current);
					},
				}}
			>
				<div style={{ height: '600px' }}>
					<AMap />
				</div>
				<Form form={form}>{createFormItem(formItem)}</Form>
				<form action='http://localhost:8080/upload' method='post' encType='multipart/form-data'>
					<input type='file' name='file'></input>
					<input type='submit'></input>
				</form>
			</Modal>
			<Timeline
				mode='left'
				items={[
					{
						label: '2021-10-28',
						children: '合同签订',
					},
					{
						label: '2022-02-14',
						children: '系统试运行',
					},
					{
						label: '2022-02-28',
						children: '系统初步验收',
					},
					{
						label: '2022-03-09',
						children: '系统正式运行',
					},
					{
						label: '2023-03-15',
						children: '系统最终验收',
					},
					{
						label: '2024-03',
						children: '支付最后15%',
					},
				]}
			/>
		</>
	)
}
