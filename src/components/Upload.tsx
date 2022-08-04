/* eslint-disable react-hooks/exhaustive-deps */
import { useState, forwardRef, useEffect, Ref, useImperativeHandle } from 'react'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, Button, message, UploadFile, UploadProps } from 'antd'
import fetchJson from '../utils/fetch'
import { UploadFileStatus } from 'antd/lib/upload/interface'

const DownloadBase = ''
const UploadBase = 'https://highway.nbmydigit.com/sys/common/upload'

export interface MyUploadProps extends UploadProps {
	defaultFileListById?: { id: string; flag: string }
	defaultFileListByPath?: string
	onFileChange?: Function
	ref?: Ref<any>
}
export default forwardRef<any, MyUploadProps>((props, ref) => {
	let { onFileChange, listType = 'text' } = props
	const [fileList, setfileList] = useState<UploadFile[]>([])
	//根据ID获取已上传的附件列表
	useEffect(() => {
		let { defaultFileListById } = props
		if (!defaultFileListById || !defaultFileListById?.id) return
		let { id, flag } = defaultFileListById
		fetchJson(`/xy/enclosure/getList?id=${id}${flag ? `&flag=${flag}` : ''}`).then(
			(res) => {
				if (!res) return
				let { ok, result, msg } = res
				if (ok) {
					let fileList = result.map(({ id, name }: { id: string; name: string }) => {
						return {
							uid: id,
							name,
							status: 'done',
							url: `${DownloadBase}?id=${id}`,
							id,
						}
					})
					if (fileList.length > 0) {
						setfileList(fileList)
						onFileChange?.(fileList)
					}
				} else {
					message.error(`${flag}文件获取失败，错误原因：${msg}`)
				}
			},
			() => {
				message.error('服务器连接失败，刷新页面后重试')
			}
		)
	}, [])
	// 根据path获取已上传的附件列表
	useEffect(() => {
		let { defaultFileListByPath } = props
		if (!defaultFileListByPath) return
		let status: UploadFileStatus = 'done'
		let fileList = defaultFileListByPath.split(',').map((path: string) => {
			return {
				uid: path,
				name: path.split('/').slice(-1)[0],
				status,
				url: `${DownloadBase}${path}`,
			}
		})
		setfileList(fileList)
		onFileChange?.(fileList)
	}, [])

	//----------------------------------------  ----------------------------------------

	const onChange: UploadProps['onChange'] = ({ file, fileList }) => {
		let { status, name } = file
		switch (status) {
			case 'done':
				let { response } = file
				let { result } = response
				if (!response.success) {
					file.status = 'error'
					message.error(response.message)
				} else {
					file.url = `${DownloadBase}${result}`
					message.success(`${name}上传成功`)
				}
				break
			case 'error':
				message.error(`${name}上传失败，请删除后重试`)
				break
			default:
				break
		}
		setfileList(fileList)
		onFileChange?.(fileList)
	}
	const beforeUpload = (file: UploadFile<any>) => {
		if (!file.size) return
		const sizelimit10M = file.size / 1024 / 1024 <= 10
		if (!sizelimit10M) {
			message.error('文件大小不可超过10M!')
			return Upload.LIST_IGNORE
		}
		return sizelimit10M
	}
	const uploadProps = {
		action: UploadBase,
		headers: { 'X-Access-Token': localStorage.getItem('token') || '' },
		beforeUpload,
		...props,
	}
	//----------------------------------------  ----------------------------------------
	// 将文件列表传入ref
	useImperativeHandle(ref, () => fileList, [fileList])
	return (
		<Upload {...uploadProps} onChange={onChange} fileList={fileList}>
			{listType === 'picture-card' ? (
				<div>
					<PlusOutlined />
					<div style={{ marginTop: 8 }}>上传图片</div>
				</div>
			) : (
				<Button icon={<UploadOutlined />}>上传文件</Button>
			)}
		</Upload>
	)
})
