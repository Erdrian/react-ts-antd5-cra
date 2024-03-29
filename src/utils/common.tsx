import { ConfigProvider, Descriptions, Image, message, Modal, Space } from 'antd'
import { DownloadBase, uploadValue } from '../components/Upload'
import zhCN from 'antd/es/locale/zh_CN'
import { EyeOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'
import { DescriptionsItemProps } from 'antd/es/descriptions/Item'

//---------------------------------------- 防抖 ----------------------------------------
export function debounce(fn: Function, delay: number = 300) {
	let timer: null | number = null
	return () => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = window.setTimeout(fn, delay)
	}
}

//---------------------------------------- 生成随机密码密码 ----------------------------------------
export const randomPassword = (length: number) => {
	// Limit length
	if (length < 6) {
		length = 6
	} else if (length > 16) {
		length = 16
	}
	let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()']
	var password = []
	let n = 0
	for (let i = 0; i < length; i++) {
		// If password length less than 9, all value random
		if (password.length < length - 4) {
			// Get random passwordArray index
			let arrayRandom = Math.floor(Math.random() * 4)
			// Get password array value
			let passwordItem = passwordArray[arrayRandom]
			// Get password array value random index
			// Get random real value
			let item = passwordItem[Math.floor(Math.random() * passwordItem.length)]
			password.push(item)
		} else {
			// If password {Size} then 9, lastest 4 password will push in according to the random password index
			// Get the array values sequentially
			let newItem = passwordArray[n]
			let lastItem = newItem[Math.floor(Math.random() * newItem.length)]
			// Get array splice index
			let spliceIndex = Math.floor(Math.random() * password.length)
			password.splice(spliceIndex, 0, lastItem)
			n++
		}
	}
	return password.join('')
}
//---------------------------------------- 获取字典 ----------------------------------------
type getDictRes = {
	[key: string]: any[]
}
export const getDict = (dictNames: string[], reversal = false): getDictRes => {
	type dictItemsType = {
		[key: string]: { value: string; text: string; title: string }[]
	}
	let dictItems = JSON.parse(localStorage.getItem('DictItems') || '{}') as dictItemsType
	let result = {}
	dictNames.forEach((dictName) => {
		let dictItem = dictItems[dictName]
		let dict = {}
		let option: { value: string; label: string }[] = []
		if (dictItem) {
			dictItem.forEach(({ value, text }) => {
				// 创建字典
				if (reversal) {
					dict[text] = value
				} else {
					dict[value] = text
				}
				// 创建选项
				option.push({ value, label: text })
			})
		} else {
			console.error(`字典："${dictName}"，解析失败`)
		}
		result[dictName] = [dict, option]
	})
	return result
}
//---------------------------------------- 通用的必填提示 ----------------------------------------
export const CommonRequiredRules = (message?: string) => ({
	rules: [
		{
			required: true,
			message: message || '必填',
		},
	],
})
//---------------------------------------- 滚动到指定hash位置 ----------------------------------------
export const scrollToAnchor = (hash: string) => {
	if (hash) {
		const anchorElement = document.getElementById(hash.slice(1))
		if (anchorElement) {
			let top = anchorElement.offsetTop + anchorElement.clientHeight
			window.scrollTo({ behavior: 'smooth', top })
		}
	}
}
//---------------------------------------- 附件下载相关 ----------------------------------------
// 使用文件id，从服务器请求附件，返回blob对象
export const getBlobByFileId = async (fileId: string): Promise<Blob> => {
	const Authorization = `Bearer ${localStorage.getItem('token') || ''}`
	let res = await fetch(`${DownloadBase}?fileId=${fileId}`, { method: 'GET', headers: { Authorization } })
	let blob = await res.blob()
	return blob
}

// 图片的弹窗
const showPicture = (url: string) => {
	Modal.info({
		content: (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<ConfigProvider locale={zhCN}>
					<Image
						alt='example'
						src={url}
						preview={{
							mask: (
								<Space>
									<EyeOutlined />
									<span>查看原图</span>
								</Space>
							),
						}}
					/>
				</ConfigProvider>
			</div>
		),
		okText: '关闭',
		icon: null,
		width: 650,
	})
}
// 点击下载
const onDownlaodClick = (url: string, filename: string) => {
	let a = document.createElement('a')
	a.href = url
	a.setAttribute('download', filename)
	a.click()
	a.remove()
}
// 文件类型判断，决定用哪种方式展示附件
const handlePreview = (url: string, type: string, fileName: string) => {
	// 判断文件是否图片
	const isImage = (type: string) => (type.includes('image') ? 'image/*' : type)
	switch (isImage(type)) {
		case 'application/pdf':
			window.open(url, '_blank')
			break
		case 'image/*':
			showPicture(url)
			break
		default:
			onDownlaodClick(url, fileName)
			break
	}
}
type URLCACHE = {
	fileId: string
	url: string
	type: string
}

// 附件点击回调函数
export const handleDownload = (file: uploadValue | undefined, onFinish?: Function) => {
	const _download = () => {
		const URLCACHE = JSON.parse(localStorage.getItem('URLCACHE') || '[]') as URLCACHE[]
		if (!file)
			return () => {
				message.error('获取下载地址失败，请刷新页面后重试')
			}
		let { fileId, fileTitle } = file
		// 本地缓存有文件时，直接展示文件
		let tar = URLCACHE.find((element) => element.fileId === fileId)
		if (tar) {
			let { url, type } = tar
			handlePreview(url, type, fileTitle)
			return
		}
		// 本地没有缓存时，请求服务器
		const hide = message.loading('附件加载中...', 0)
		getBlobByFileId(fileId).then((blob) => {
			hide()
			let { type } = blob
			let url = window.URL.createObjectURL(blob)
			URLCACHE.push({ fileId, url, type })
			localStorage.setItem('URLCACHE', JSON.stringify(URLCACHE))
			handlePreview(url, type, fileTitle)
			onFinish?.()
		})
	}
	return debounce(_download, 200)
}
// 附件按钮
export const enclosureButtonRender = (value: uploadValue[] | undefined) => {
	if (!value) return <></>
	else {
		return value.map((item, i) => (
			<span className='download-link' key={i} onClick={handleDownload(item)}>
				{value && value.length > 1 ? `附件${i + 1}` : '查看'}
			</span>
		))
	}
}

//---------------------------------------- DescriptionItemsRender ----------------------------------------
export type customDescriptionItems = {
	label: string
	dataIndex: string
	descriptionsItemProps?: DescriptionsItemProps
	render?: (value?: any, data?: { [key: string]: any }) => ReactNode
}
export const DescriptionItemsRender = (
	descriptionItems: customDescriptionItems[],
	data: { [key: string]: any }
): ReactNode => {
	return descriptionItems.map((descriptionItem, i) => {
		let { label, dataIndex, render, descriptionsItemProps } = descriptionItem
		return (
			<Descriptions.Item label={label} key={i} {...(descriptionsItemProps || {})}>
				{render ? render(data[dataIndex], data) : data[dataIndex]}
			</Descriptions.Item>
		)
	})
}
