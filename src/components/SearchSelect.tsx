import { useEffect, useState } from 'react'
import { Select, SelectProps } from 'antd'

export type option = {
	label: string
	value: any
}
export interface SearchSelectProps extends SelectProps {
	customProps?: {
		initOption?: { label: string; value: any }[]
		getOptionData: (value: string) => Promise<{
			data: { label: string; value: any }[]
			query: string
		}>
		onValueChange?: (value: string) => void
	}
}

const SearchSelect = (props: SearchSelectProps) => {
	//---------------------------------------- props ----------------------------------------
	let { initOption, getOptionData, onValueChange } = props.customProps || {}
	let { onChange, value } = props
	let inputOptions = { ...props }
	delete inputOptions.customProps
	let timeout: ReturnType<typeof setTimeout> | null
	let currentValue: string
	//---------------------------------------- state ----------------------------------------
	const [data, setData] = useState<any[]>([])
	const [_value, setValue] = useState<string>()
	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		initOption && setData(initOption)
	}, [initOption])
	useEffect(() => {
		setValue(value)
	}, [value])
	//---------------------------------------- 方法 ----------------------------------------
	function fetch(value: string, callback: (data: any) => void) {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
		currentValue = value
		async function fake() {
			if (getOptionData) {
				let { query, data } = await getOptionData(value)
				if (query === currentValue) {
					callback(data)
				}
			}
		}
		timeout = setTimeout(fake, 300)
	}
	const handleSearch = (value: any) => {
		if (value) {
			fetch(value, (data) => setData(data))
		} else {
			setData([])
		}
	}
	const handleChange = (value: any) => {
		onValueChange?.(value)
		setValue(value)
		onChange?.(value, data)
	}
	return (
		<Select
			{...inputOptions}
			showSearch
			value={_value}
			defaultActiveFirstOption={false}
			showArrow={false}
			filterOption={false}
			onSearch={handleSearch}
			onChange={handleChange}
			options={data}
		></Select>
	)
}
export default SearchSelect
