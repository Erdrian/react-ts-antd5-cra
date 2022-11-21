import { ArrowLeftOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import '../style/PageHeader.css'
import Breadcrumb, { getBreadcrumbNameMap } from './Breadcrumb'

type props = {
	avatar?: ReactNode
	title?: ReactNode
	backIcon?: ReactNode | boolean
	breadcrumb?: ReactNode
	extra?: ReactNode
	footer?: ReactNode
	subTitle?: ReactNode
	tags?: ReactNode
	onBack?: () => void
	autoBread?: boolean
	children?: ReactNode
}
export default (props: props) => {
	const breadcrumbNameMap = getBreadcrumbNameMap()
	const { pathname } = useLocation()
	const paths = pathname.split('/').filter((i) => i)
	let defaultTitle: string = ''
	for (let i = paths.length; i >= 1; i--) {
		let path = paths.slice(0, i).join('/')
		if (breadcrumbNameMap[path]) {
			defaultTitle = breadcrumbNameMap[path]
			break
		}
	}
	const {
		avatar,
		title = defaultTitle,
		backIcon = <ArrowLeftOutlined />,
		extra,
		footer,
		subTitle,
		tags,
		onBack,
		autoBread = true,
		children,
	} = props
	return (
		<div className={`page-header ${footer ? 'has-footer' : ''} ${autoBread ? 'has-breadcrumb' : ''}`}>
			{/* 面包屑 */}
			{autoBread ? <Breadcrumb /> : <></>}
			{/* header */}
			<div className='page-header-heading'>
				<div className='page-header-heading-left'>
					{/* 返回箭头 */}
					{onBack ? (
						<div className='page-header-back' onClick={onBack}>
							{backIcon}
						</div>
					) : (
						<></>
					)}

					{/* 头像 */}
					{avatar ? avatar : <></>}

					{/* 标题 */}
					<span
						className='page-header-heading-title'
						{...(typeof title === 'string' ? { title } : undefined)}
					>
						{title}
					</span>

					{/* 副标题 */}
					{subTitle ? (
						<span
							className='page-header-heading-sub-title'
							{...(typeof subTitle === 'string' ? { subTitle } : undefined)}
						>
							{subTitle}
						</span>
					) : (
						<></>
					)}

					{/* 标签 */}
					{tags ? <span className='page-header-heading-tags'>{tags}</span> : <></>}
				</div>
				<span className='page-header-heading-extra'>{extra}</span>
			</div>
			{/* content */}
			{children ? <div className='page-header-content'>{children}</div> : <></>}
			{/* footer */}
			{footer ? <div className='page-header-footer'>{footer}</div> : <></>}
		</div>
	)
}
