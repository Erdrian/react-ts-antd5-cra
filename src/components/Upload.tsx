import { useState, forwardRef, useEffect, Ref, useImperativeHandle } from 'react'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, Button, message, UploadFile, UploadProps } from 'antd'
import fetchJson, {  } from '../utils/fetch'
import { handleDownload } from '../utils/common'
//----------------------------------------  ----------------------------------------
const BASE = 'http://localhost/8080'
export const DownloadBase = `${BASE}/api/File/Download`
export const PublicBase = `${BASE}/api/File/Show`
export const UploadBase = `${BASE}/upload`
//---------------------------------------- type ----------------------------------------
export interface MyUploadProps<T = any> extends UploadProps {
	onFileChange?: Function
	ref?: Ref<any>
	placeholder?: string
	value: T
	valueFormatter?: (file: UploadFile) => T
}

export type uploadValue = { fileId: string; fileTitle: string }

type response = {
	code: string
	message: string
	result: { fileIds: string[] }
	success: boolean
}
//----------------------------------------  ----------------------------------------


//----------------------------------------  ----------------------------------------
export default forwardRef<any, MyUploadProps<uploadValue[]>>((props, ref) => {
	//---------------------------------------- props ----------------------------------------
	const Authorization = `Bearer ${localStorage.getItem('token') || ''}`
	let { onFileChange, listType = 'text', placeholder, value, valueFormatter } = props
	//---------------------------------------- state ----------------------------------------
	const [fileList, setfileList] = useState<UploadFile[]>([])
	//---------------------------------------- effect ----------------------------------------

	useEffect(() => {
		value && setfileList(getFileListByValue(value))
	}, [value])
	//---------------------------------------- 方法 ----------------------------------------
	const onChange: UploadProps<response>['onChange'] = ({ file, fileList }) => {
		let { status, name, response } = file
		switch (status) {
			case 'done':
				if (!response) {
					message.error('上传失败，删除文件后重试')
					file.status = 'error'
					return
				} else {
					let { result } = response
					if (!response.success) {
						file.status = 'error'
						message.error(`${name}上传失败：${response.message}`)
					} else {
						let [fileId] = result.fileIds
						file.uid = fileId
						file.url = `${DownloadBase}?fileId=${fileId}&access_token=${localStorage.getItem('token') || ''}`
						message.success(`${name}上传成功`)
					}
					break
				}
			case 'error':
				message.error(`${name}上传失败：${response?.message || ''}`)
				break
			default:
				break
		}
		setfileList(fileList)
		if (status !== 'uploading') {
			onFileChange?.(getValueByFileList(fileList))
		}
	}
	const getFileListByValue = (value: uploadValue[]): UploadFile[] =>
		value.map(({ fileId, fileTitle }) => ({
			uid: fileId,
			name: fileTitle,
			status: 'done',
			url: `${DownloadBase}?fileId=${fileId}&access_token=${localStorage.getItem('token') || ''}`,
		}))
	const getValueByFileList = (filelist: UploadFile<response>[]) => {
		let _value: {}[] | undefined = []
		filelist.forEach((file) => {
			if (file.status === 'done') {
				_value?.push(valueFormatter?.(file) || { fileId: file.uid, fileName: file.name })
			}
		})
		_value = _value.length > 0 ? _value : undefined
		return _value
	}
	const beforeUpload = (file: UploadFile) => {
		const accept = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
		if (!file.size) return
		const sizelimit10M = file.size / 1024 / 1024 <= 10
		const accepted = accept.includes(file.type || '')
		if (!sizelimit10M) {
			message.error('文件大小不可超过10M!')
			return Upload.LIST_IGNORE
		}
		if (!accepted) {
			message.error('仅支持PNG、JPG、PDF格式的文件!')
			return Upload.LIST_IGNORE
		}
		return sizelimit10M && accepted
	}

	const onPreview = (file: UploadFile) => {
		let { uid, name } = file
		handleDownload({ fileId: uid, fileTitle: name })
	}

	const onRemove = async (file: UploadFile) => {
		let { uid, status } = file
		switch (status) {
			case 'error':
				return true
			case 'uploading':
				message.error('上传中，请稍后再试')
				return false
			case 'done':
				if (!uid) return true
				let body = JSON.stringify({ fileId: uid })
				let { ok, msg } = await fetchJson('/api/File/Delete', { method: 'POST', body })
				if (!ok) {
					message.error(`附件删除失败：${msg}，请稍后重试`)
				}
				return ok
			default:
				return true
		}
	}
	// 将文件列表传入ref
	useImperativeHandle(ref, () => fileList, [fileList])
	return (
		<>
			<Upload
				{...props}
				action={UploadBase}
				headers={{ Authorization }}
				beforeUpload={beforeUpload}
				onChange={onChange}
				fileList={fileList}
				onPreview={onPreview}
				onRemove={onRemove}
			>
				{listType === 'picture-card' ? (
					<div>
						<PlusOutlined />
						<div style={{ marginTop: 8 }}>{placeholder || '上传图片'}</div>
					</div>
				) : (
					<Button icon={<UploadOutlined />}>{placeholder || '上传文件'}</Button>
				)}
			</Upload>
		</>
	)
})
