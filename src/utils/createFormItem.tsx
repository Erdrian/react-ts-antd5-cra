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
} from 'antd'
import { PasswordProps, TextAreaProps } from 'antd/lib/input'
import MyUpload, { MyUploadProps } from '../components/Upload'
import RichText from '../components/RichText'
import SearchSelect, { SearchSelectProps } from '../components/SearchSelect'
const { Item } = Form

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
export interface formItem {
	type: formItemType
	inputOptions?: InputProps &
		InputNumberProps &
		MyUploadProps &
		TextAreaProps &
		PasswordProps &
		DatePickerProps &
		RadioProps &
		RadioGroupProps &
		SwitchProps & 
		SelectProps &
		TreeSelectProps &
		SearchSelectProps
	itemOptions: FormItemProps
	span?: number
	group?: formItem[]
}
export const createFormItem = (formItem: formItem, index?: number) => {
	let { type, inputOptions, itemOptions, group } = formItem
	let inputNode
	switch (type) {
		case 'input':
			inputNode = <Input {...inputOptions} />
			break
		case 'inputNumber':
			inputNode = <InputNumber {...inputOptions} style={{ width: '100%', ...inputOptions?.style }} />
			break
		case 'select':
			inputNode = <Select {...inputOptions} />
			break
		case 'upload':
			inputNode = <MyUpload {...inputOptions} />
			break
		case 'textArea':
			inputNode = <Input.TextArea {...inputOptions} />
			break
		case 'password':
			inputNode = <Input.Password {...inputOptions} />
			break
		case 'searchSelect':
			inputNode = <SearchSelect {...inputOptions} />
			break
		case 'datePicker':
			inputNode = <DatePicker {...inputOptions} />
			break
		case 'radio':
			inputNode = <Radio.Group {...inputOptions} />
			break
		case 'switch':
			inputNode = <Switch {...inputOptions} />
			break
		case 'treeSelect':
			inputNode = <TreeSelect {...inputOptions} />
			break
		case 'richText':
			inputNode = <RichText {...inputOptions} />
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
