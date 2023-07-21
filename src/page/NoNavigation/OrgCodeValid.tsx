import { Button, Input, message } from 'antd'
import { useState } from 'react'
import fetchJson from '../../utils/fetch'

export default () => {
	const [value, setvalue] = useState('')
	//----------------------------------------  ----------------------------------------
	const onChange = (e: any) => setvalue(e.target.value)
	const valid = () => {
		fetchJson(`/organizationValid?code=${value}`).then((v) => {
			let { ok, result } = v
			if (ok) {
				if (result) {
					message.success('有效的组织机构代码')
				} else {
					message.error('无效的组织机构代码')
				}
			}
		})
	}
	return (
		<>
			<div
				style={{ display: 'flex', gap: '8px', width: '500px', margin: '300px auto', position: 'relative' }}
			>
				<Input placeholder='请输入组织机构代码' value={value} onChange={onChange} />
				<Button type='primary' onClick={valid}>
					校验
				</Button>
			</div>
		</>
	)
}
