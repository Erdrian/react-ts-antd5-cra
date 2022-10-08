import {
	Input,
	Select,
	Row,
	Col,
	Form,
	DatePicker,
	Radio,
	Switch,
	InputProps,
	InputNumberProps,
	SelectProps,
	DatePickerProps,
	RadioProps,
	SwitchProps,
	TreeSelectProps,
	RadioGroupProps,
	FormItemProps,
	TreeSelect,
	InputNumber,
	Cascader,
	CascaderProps,
} from 'antd'
import { PasswordProps, TextAreaProps } from 'antd/lib/input'
import MyUpload, { MyUploadProps } from '../components/Upload'
import RichText from '../components/RichText'
import SearchSelect, { SearchSelectProps } from '../components/SearchSelect'
import divisionOptions from './aera'

//----------------------------------------  ----------------------------------------
const { Item } = Form
//----------------------------------------  ----------------------------------------
type formItemType =
	| 'input'
	| 'inputNumber'
	| 'select'
	| 'upload'
	| 'textArea'
	| 'password'
	| 'searchSelect'
	| 'datePicker'
	| 'radio'
	| 'switch'
	| 'treeSelect'
	| 'richText'
	| 'group'
	| 'cascader'
export interface formItem {
	type: formItemType
	inputOptions?: InputProps &
		InputNumberProps &
		SelectProps &
		MyUploadProps &
		TextAreaProps &
		PasswordProps &
		SearchSelectProps &
		DatePickerProps &
		RadioProps &
		RadioGroupProps &
		SwitchProps &
		TreeSelectProps &
		CascaderProps<any>
	itemOptions: FormItemProps
	span?: number
	group?: formItem[]
}
const normFile = (e: any) => {
	if (Array.isArray(e)) {
		return e
	}
	return e && e.fileList
}
const FormUploadProps = {
	valuePropName: 'fileList',
	getValueFromEvent: normFile,
	trigger: 'onFileChange',
}

export const createFormItem = (formItem: formItem, index?: number) => {
	let { type, inputOptions, itemOptions, group } = formItem
	let inputNode
	switch (type) {
		case 'input':
			inputNode = <Input {...(inputOptions as InputProps)} />
			break
		case 'inputNumber':
			inputNode = (
				<InputNumber
					{...(inputOptions as InputNumberProps)}
					style={{ width: '100%', ...inputOptions?.style }}
				/>
			)
			break
		case 'select':
			inputNode = <Select {...(inputOptions as SelectProps)} />
			break
		case 'upload':
			itemOptions = { ...itemOptions, ...FormUploadProps }
			inputNode = <MyUpload {...(inputOptions as MyUploadProps)} />
			break
		case 'textArea':
			inputNode = <Input.TextArea {...(inputOptions as TextAreaProps)} />
			break
		case 'password':
			inputNode = <Input.Password {...(inputOptions as PasswordProps)} />
			break
		case 'searchSelect':
			inputNode = <SearchSelect {...(inputOptions as SearchSelectProps)} />
			break
		case 'datePicker':
			inputNode = (
				<DatePicker
					{...(inputOptions as DatePickerProps)}
					style={{ width: '100%', ...inputOptions?.style }}
				/>
			)
			break
		case 'radio':
			inputNode = <Radio.Group {...(inputOptions as RadioProps & RadioGroupProps)} />
			break
		case 'switch':
			inputNode = <Switch {...(inputOptions as SwitchProps)} />
			break
		case 'treeSelect':
			inputNode = <TreeSelect {...(inputOptions as TreeSelectProps)} />
			break
		case 'richText':
			inputNode = <RichText {...inputOptions} />
			break
		case 'cascader':
			inputNode = <Cascader options={divisionOptions} {...(inputOptions as CascaderProps<any>)} />
			break
		case 'group':
			inputNode = (
				<Row gutter={8}>
					{group?.map(({ type, itemOptions, inputOptions, span = 12 }, index) => {
						return (
							<Col span={span} key={index}>
								{createFormItem({
									type,
									inputOptions,
									itemOptions,
								})}
							</Col>
						)
					})}
				</Row>
			)
			break
		default:
			inputNode = <Input {...inputOptions} />
	}
	if (type === 'group') {
		itemOptions.style = { marginBottom: 0 }
	}
	return (
		<Item {...itemOptions} key={index}>
			{inputNode}
		</Item>
	)
}
