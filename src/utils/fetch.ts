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
		let { success, message, result, code, timestamp } = await res.json()
		return { ok: success, result, msg: message, code, timestamp }
	} catch (e) {
		console.log(e)
		message.error('服务器连接失败')
	}
}
