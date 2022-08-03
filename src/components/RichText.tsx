import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export const StringToHtml = ({ htmlString }: { htmlString: string }) => {
	const createMarkup = () => {
		return { __html: htmlString }
	}
	return <div dangerouslySetInnerHTML={createMarkup()} />
}

const RichText = (props: any) => {
	let { value = '', onChange } = props
	const [cmpValue, setcmpValue] = useState<string>(value)
	const onChangeComplete = (value: string) => {
		setcmpValue(value)
		onChange(value)
	}
	return <ReactQuill {...props} value={cmpValue} onChange={onChangeComplete} />
}
export default RichText
