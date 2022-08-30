import { Row, Col, CollapseProps } from 'antd'
import BlockContent from './BlockContent'
import { createFormItem, formItem } from '../utils/createFormItem'

export type MultiFromProps = {
	title: string
	collapseProps?: CollapseProps
	formItems: formItem[]
	span?: number
}[]

export default (props: MultiFromProps) => {
	return (
		<Row gutter={16}>
			{props.map(({ title, collapseProps, formItems, span = 24 }, index) => {
				return (
					<Col span={span} key={index}>
						<BlockContent className='multi-form-block' title={title} showArrow={false} {...collapseProps}>
							<Row gutter={[{ xs: 32, sm: 32, md: 32, lg: 32, xl: 48, xxl: 64 }, 16]}>
								{formItems.map((formItem, index) => {
									let s = formItem.span || 1
									let span = {
										xs: 8 * s,
										sm: 8 * s,
										md: 8 * s,
										lg: 8 * s,
										xl: 8 * s,
										xxl: 6 * s,
									}
									return (
										<Col {...span} key={index}>
											{createFormItem(formItem)}
										</Col>
									)
								})}
							</Row>
						</BlockContent>
					</Col>
				)
			})}
		</Row>
	)
}
