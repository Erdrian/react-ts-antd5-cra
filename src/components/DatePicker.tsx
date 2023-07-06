import { DatePicker, DatePickerProps } from 'antd'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

export type MyDatePickerProps = DatePickerProps & {
	valueFormat?: string
	onChange?: (value: string | null) => void
}
export default (props: MyDatePickerProps) => {
	let { value, onChange, valueFormat, picker = 'date' } = props
	let format = 'YYYY-MM-DD'
	switch (picker) {
		case 'date':
			break
		case 'month':
			format = 'YYYY-MM'
			break
		case 'year':
			format = 'YYYY'
			break
		case 'time':
			format = 'YYYY-MM-DD hh:mm:ss'
			break
		default:
			break
	}
	//----------------------------------------  ----------------------------------------
	const [_value, setvalue] = useState<dayjs.Dayjs | null>(null)
	//----------------------------------------  ----------------------------------------
	useEffect(() => {
		if (value === undefined) {
			setvalue(null)
			return
		}
		let _value
		if (value && dayjs(value).isValid()) {
			_value = dayjs(value)
		} else {
			_value = null
			onChange?.(null)
		}
		setvalue(_value)
	}, [value])
	//----------------------------------------  ----------------------------------------
	const handleChange = (date: dayjs.Dayjs | null) => {
		let _value = date ? dayjs(date).format(valueFormat || format) : null
		onChange?.(_value)
	}
	return <DatePicker {...props} value={_value} onChange={handleChange}></DatePicker>
}
