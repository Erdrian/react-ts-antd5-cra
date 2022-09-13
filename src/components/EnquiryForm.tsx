import { useEffect, useState, forwardRef, useCallback, ReactNode, useImperativeHandle } from 'react'
import { Table, TableProps } from 'antd'
import fetchJson from '../utils/fetch'
import SearchForm from './SearchForm'
import { formItem } from '../utils/createFormItem'
import '../css/EnquiryForm.css'
import { useLocation, useNavigate } from 'react-router-dom'

export type EnquiryFormProps = {
	api: string
	filter_api?: { [key: string]: any }
	auth?: boolean
	searchItems?: formItem[]
	content?: ReactNode
	sortRule?: { column: string; order: 'ASC' | 'DESC' }
	tableProps: TableProps<any>
	detail?: boolean
}
export type filterInHistory =
	| {
			filter_history: {}
			page_history: number
			pageSize_history: number
	  }
	| undefined

export default forwardRef<any, EnquiryFormProps>((props, ref) => {
	//---------------------------------------- props ----------------------------------------
	let { api, filter_api, searchItems, content, sortRule, tableProps, detail = false } = props
	const location = useLocation()
	const navigate = useNavigate()
	let state = location.state as filterInHistory
	let pathname = location.pathname
	const { filter_history = {}, page_history = 1, pageSize_history = 10 } = state || {}
	//---------------------------------------- state ----------------------------------------
	const [dataSource, setdataSource] = useState([])
	const [isLoading, setIsloading] = useState(false) //  数据是否载入中
	const [current, setCurrent] = useState(page_history) //  当前页
	const [pageSize, setPageSize] = useState(pageSize_history) //  每页数据条数
	const [filter, setFilter] = useState(filter_history) //  筛选条件
	const [total, setTotal] = useState<number>(0) //  数据总量

	//---------------------------------------- effect ----------------------------------------
	useEffect(() => {
		getData({ filter, page: current, pageSize })
	}, [])
	//---------------------------------------- 方法 ----------------------------------------
	// 数据处理，给每个数据加上key
	const dataProcess = (records: []) => {
		records.forEach((record: { children?: any; id?: number; key?: number }, index: number) => {
			if (record.children) {
				dataProcess(record.children)
			}
			record.key = record.id || index
		})
	}
	// 表格数据获取方法
	const getData = async (props: { filter: {}; page: number; pageSize: number }) => {
		setIsloading(true)
		let { filter, page, pageSize } = props
		//筛选条件
		let filterStr = ''
		for (let key in filter) {
			if (filter[key] === undefined) continue
			filterStr += `&${key}=${filter[key]}`
		}
		if (filter_api) {
			for (let key in filter_api) {
				filterStr += `&${key}=${filter_api[key]}`
			}
		}
		//排序
		let sort = sortRule ? `&column=${sortRule.column}&order=${sortRule.order}` : ''
		let { ok, result } = await fetchJson(`${api}?pageNo=${page}&pageSize=${pageSize}${filterStr}${sort}`)
		if (ok) {
			let { total, records } = result
			if (!records) records = result
			dataProcess(records)
			setdataSource(records)
			setTotal(total)
		}
		setIsloading(false)
	}

	// 暴露表格数据获取方法给父组件
	useImperativeHandle(ref, () => ({ getData }))

	// 搜索时跳转url的公共方法
	const navigateWithSearch = (filter: {}, page: number, pageSize: number) => {
		navigate(pathname, {
			state: { filter_history: filter, page_history: page, pageSize_history: pageSize },
			replace: true,
		})
	}
	// 搜素时的回调函数
	const onSearch = useCallback((filter: {}) => {
		setCurrent(1)
		setFilter(filter)
		getData({ page: 1, pageSize, filter })
		navigateWithSearch(filter, 1, pageSize)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// 重置搜索时的回调函数
	const onReset = useCallback(() => {
		setCurrent(1)
		setFilter({})
		getData({ page: 1, pageSize, filter: {} })
		navigateWithSearch({}, 1, 10)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const pagination = {
		total,
		showTotal: () => `共${total}条数据`,
		onChange: (page: number, pageSize: number) => {
			setCurrent(page)
			setPageSize(pageSize)
			getData({ page, pageSize, filter })
			navigateWithSearch(filter, page, pageSize)
		},
		current,
		pageSize,
	}

	return (
		<div className={!detail ? 'list-table-content' : ''}>
			{/* 搜索区 */}
			<div className='table-search'>
				<SearchForm formItems={searchItems || []} onSearch={onSearch} onReset={onReset} />
			</div>
			{content}
			{/* 表格 */}
			<Table {...tableProps} dataSource={dataSource} pagination={pagination} loading={isLoading} />
		</div>
	)
})
