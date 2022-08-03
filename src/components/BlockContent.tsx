import { Collapse } from 'antd'
import { ReactNode } from 'react'
const { Panel } = Collapse

export interface blockContentProps {
	title?: string
	defaultActive?: boolean
	showArrow?: boolean
	children: ReactNode
	className?: string
	collapseProps?: {}
	panelProps?: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default ({
	title = '暂无标题',
	defaultActive = true,
	className = '',
	children,
	collapseProps,
	panelProps,
}: blockContentProps) => {
	return (
		<Collapse
			bordered={false}
			expandIconPosition='right'
			defaultActiveKey={defaultActive ? '1' : undefined}
			className={`site-collapse-custom-collapse ${className}`}
			style={{ marginBottom: '12px' }}
			{...collapseProps}
		>
			<Panel
				{...panelProps}
				key='1'
				header={
					<span
						style={{
							fontSize: '20px',
							fontWeight: 'bold',
							paddingLeft: '16px',
						}}
					>
						{title}
					</span>
				}
			>
				{children}
			</Panel>
		</Collapse>
	)
}
