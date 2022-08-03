import React from 'react'
import { InputNumber, InputNumberProps } from 'antd'

// eslint-disable-next-line import/no-anonymous-default-export
export default (
	props: JSX.IntrinsicAttributes &
		InputNumberProps<string | number> & { children?: React.ReactNode } & {
			ref?: React.Ref<HTMLInputElement> | undefined
		}
) => {
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				alignItems: 'stretch',
				...(props.style ? props.style : {}),
			}}
		>
			<InputNumber {...props} style={{ flex: '1' }} />
		</div>
	)
}
