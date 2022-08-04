import { message } from 'antd'

// export const BASE: string = 'http://localhost:8080'
export const BASE = 'https://devsli.nbmydigit.com/api'

export default async function fetchJson(URL: string, options?: { headers?: {} }) {
	const token: string = localStorage.getItem('token') || ''
	const headers: {} | undefined = options?.headers
	try {
		let Options = { ...options }
		let defaultHeaders = { 'X-Access-Token': token, 'Content-Type': 'application/json; charset=UTF-8' }
		if (headers) {
			defaultHeaders = { ...defaultHeaders, ...headers }
		}
		Options = { ...Options, headers: { ...defaultHeaders } }
		let res = await fetch(BASE + URL, Options)
		let {
			success,
			message: msg,
			result,
			code,
			timestamp,
		} = (await res.json()) || {
			success: false,
			message: '数据解析失败',
			result: null,
		}
		if (!success) {
			message.error(msg)
		}
		return { ok: success, result, msg, code, timestamp }
	} catch (e) {
		console.log(e)
		return { ok: false, message: '服务器连接失败', result: null }
	}
}
 