import { useState, forwardRef, useEffect, Ref, useImperativeHandle } from 'react'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, Button, message, UploadFile, UploadProps } from 'antd'
import fetchJson, { BASE } from '../utils/fetch'
import { handleDownload } from '../utils/common'
//----------------------------------------  ----------------------------------------
export const DownloadBase = `${BASE}/api/File/Download`
export const PublicBase = `${BASE}/api/File/Show`
export const UploadBase = `${BASE}/api/File/Upload`
//---------------------------------------- type ----------------------------------------
export interface MyUploadProps extends UploadProps {
	onFileChange?: Function
	ref?: Ref<any>
	placeholder?: string
}
export type Enclosure_Form = {
	[key: string]: { fileIds: string[] }
}
export type Enclosure_Detail = { fileId: string; fileTitle: string }
type response = {
	code: string
	message: string
	result: { fileIds: string[] }
	success: boolean
}
//----------------------------------------  ----------------------------------------
// 从文件列表获取fileIds数组
export const getFileIds = (
	fileList: UploadFile<response>[]
): {
	ok: boolean
	result?: { fileId: string }[]
	msg?: string
} => {
	let fileIds: { fileId: string }[] = []
	if (!fileList) return { ok: true, result: fileIds }
	try {
		fileList.forEach((file) => {
			let { uid, status, name } = file
			if (status !== 'done') {
				throw new Error(`文件：${name}，上传状态异常`)
			}
			fileIds.push({ fileId: uid })
		})
	} catch (e: any) {
		return { ok: false, msg: e.message as string }
	}
	return { ok: true, result: fileIds }
}
// 表单中的文件列表转化为表单需要的附件格式
export const getFileIdsFromForm = (value: {
	[key: string]: UploadFile<response>[]
}): {
	success: boolean
	result?: Enclosure_Form
	msg?: string
} => {
	if (!value) return { success: false, msg: '附件非法' }
	let res = {}
	try {
		Object.entries(value).forEach((item) => {
			let [key, value] = item
			let { ok, msg, result } = getFileIds(value)
			if (ok) {
				res[key] = result
			} else {
				throw new Error(msg)
			}
		})
		return { success: true, result: res }
	} catch (e: any) {
		return { success: false, msg: e.message as string }
	}
}
//根据ID获取已上传的附件列表
export const getFileListById = (value: Enclosure_Detail[]): UploadFile[] =>
	value.map(({ fileId, fileTitle }) => ({
		uid: fileId,
		name: fileTitle,
		status: 'done',
		url: `${DownloadBase}?fileId=${fileId}&access_token=${localStorage.getItem('token') || ''}`,
	}))
//----------------------------------------  ----------------------------------------
export default forwardRef<any, MyUploadProps>((props, ref) => {
	//---------------------------------------- props ----------------------------------------
	const Authorization = `Bearer ${localStorage.getItem('token') || ''}`
	let { onFileChange, listType = 'text', placeholder } = props
	//---------------------------------------- state ----------------------------------------
	const [fileList, setfileList] = useState<UploadFile[]>([])
	//---------------------------------------- effect ----------------------------------------

	useEffect(() => {
		if (props.fileList) {
			setfileList(props.fileList)
			onFileChange?.(props.fileList)
		}
	}, [props.fileList])
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
		if (fileList.length === 0) {
			onFileChange?.(undefined)
		} else {
			onFileChange?.(fileList)
		}
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
