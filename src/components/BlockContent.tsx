import { Collapse } from 'antd'
import { ReactNode } from 'react'
import '../style/BlockContent.css'

export interface blockContentProps {
	title: string
	defaultActive?: boolean
	children: ReactNode
	className?: string
	collapseProps?: {}
	panelProps?: {}
}

export default (props: blockContentProps) => {
	let { defaultActive = true, className, panelProps, children, title, collapseProps } = props
	return (
		<Collapse
			{...collapseProps}
			bordered={false}
			expandIconPosition='end'
			defaultActiveKey={defaultActive ? '1' : undefined}
			className={`site-collapse-custom-collapse ${className}`}
			style={{ marginBottom: '12px' }}
			items={[
				{
					...panelProps,
					key: '1',
					showArrow: false,
					label: <span className='collapse-panel-title'>{title}</span>,
					children,
				},
			]}
		></Collapse>
	)
}
