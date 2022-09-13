import { PageHeader, PageHeaderProps } from 'antd'
import { useLocation } from 'react-router-dom'
import '../css/PageHeader.css'
import Breadcrumb, { getBreadcrumbNameMap } from './Breadcrumb'

export default (props: PageHeaderProps & { autoBread?: boolean }) => {
	const { title, autoBread = true } = props
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
	return (
		<PageHeader
			{...props}
			className='list-page-header'
			title={title || defaultTitle}
			breadcrumb={autoBread ? <Breadcrumb /> : undefined}
		/>
	)
}
