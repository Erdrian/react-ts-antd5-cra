import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'
import { BrowserRouter as Router } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'

dayjs.locale('zh-cn')
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<ConfigProvider locale={zhCN}>
			<Router>
				<App />
			</Router>
		</ConfigProvider>
	</React.StrictMode>
)
