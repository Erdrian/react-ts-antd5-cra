import { useEffect, useState } from 'react'
import { Select, SelectProps } from 'antd'

type option = {
	label: string
	value: any
}
export interface SearchSelectProps extends SelectProps {
	customProps?: {
		initOption?: option[]
		initValue?: string
		getOptionData: (value: string) => Promise<option[]>
		onValueChange?: (value: string) => void
	}
}

const SearchSelect = (props: SearchSelectProps) => {
	//---------------------------------------- props ----------------------------------------
	let { initOption, initValue, getOptionData, onValueChange } = props.customProps || {}
	let inputOptions = { ...props }
	delete inputOptions.customProps
	let timeout: ReturnType<typeof setTimeout> | null
	let currentValue: string
	//---------------------------------------- state ----------------------------------------
	const [data, setData] = useState<any[]>([])
	const [value, setValue] = useState<string>()
	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		initOption && setData(initOption)
		initValue && setValue(initValue)
	}, [initOption, initValue])
	//---------------------------------------- 方法 ----------------------------------------
	function fetch(value: string, callback: (data: any) => void) {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
		currentValue = value
		async function fake() {
			if (getOptionData) {
				let data = await getOptionData(value)
				if (value === currentValue) {
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
	}
	return (
		<Select
			{...inputOptions}
			showSearch
			value={value}
			defaultActiveFirstOption={false}
			showArrow={false}
			filterOption={false}
			onSearch={handleSearch}
			onChange={handleChange}
			options={data}
			notFoundContent={'暂无数据，请重新输入'}
		></Select>
	)
}
export default SearchSelect
