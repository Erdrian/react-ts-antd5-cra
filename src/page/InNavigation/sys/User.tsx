import { TableProps } from 'antd'
import EnquiryForm from '../../../components/EnquiryForm'
import PageHeader from '../../../components/PageHeader'
import { formItem } from '../../../utils/createFormItem'

interface userList {
	username: string
	realname: string
	phone: string
}
export default () => {
	const columns: TableProps<userList>['columns'] = [
		{
			dataIndex: 'username',
			title: '用户名',
		},
		{
			dataIndex: 'realname',
			title: '使用人',
		},
		{
			dataIndex: 'phone',
			title: '电话',
		},
	]
	const searchItems: formItem[] = [
		{
			itemOptions: {
				name: 'username',
				label: '用户名',
			},
		},
	]
	return (
		<>
			<PageHeader />
			<EnquiryForm api='/user/list' tableProps={{ columns }} searchItems={searchItems} />
		</>
	)
}
