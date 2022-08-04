import { useEffect, useState } from 'react'
import { Select, SelectProps } from 'antd'

export interface SearchSelectProps extends SelectProps {
	initOption?: []
	initValue?: string
	getOptionData?: (currentValue: string, value: string, callback: (data: any) => void) => void
	onValueChange?: (value: string) => void
}

const SearchSelect = (props: SearchSelectProps) => {
	let { initOption, initValue, getOptionData, onValueChange } = props
	let inputOptions = { ...props }
	useEffect(() => {
		if (initOption) {
			setData(initOption)
		}
		if (initValue) {
			setValue(initValue)
		}
	}, [initOption, initValue])
	let timeout: ReturnType<typeof setTimeout> | null
	let currentValue: string
	function fetch(value: string, callback: (data: any) => void) {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
		currentValue = value
		function fake() {
			getOptionData && getOptionData(currentValue, value, callback)
		}
		timeout = setTimeout(fake, 300)
	}
	const [data, setData] = useState<any[]>([])
	const [value, setValue] = useState<string>()
	const handleSearch = (value: any) => {
		if (value) {
			fetch(value, (data) => setData(data))
		} else {
			setData([])
		}
	}
	const handleChange = (value: any) => {
		onValueChange && onValueChange(value)
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
