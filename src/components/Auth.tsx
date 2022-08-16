import { ReactNode } from 'react'
export default (props: { action?: string; children: ReactNode; creator: string }): ReactNode => {
	const auth = JSON.parse(localStorage.getItem('Auth') || '{}')
	const { username } = JSON.parse(localStorage.getItem('UserInfo') || '{}')
	//最终控制是否渲染
	let show = false
	//判断是否拥有权限
	let hasActionAuth = false
	let { action, children, creator } = props
	if (!action) {
		hasActionAuth = true //未声明action则表示不需要权限
	} else {
		hasActionAuth = auth[action]
	}
	//判断是否是本人创建内容才能处理
	let creatorSelf = true //默认不限制一定是本人处理
	if (creator) {
		//传入该参数视为需要本人才能处理
		creatorSelf = creator === username
	}
	show = creatorSelf && hasActionAuth
	return show ? children : <></>
}
 