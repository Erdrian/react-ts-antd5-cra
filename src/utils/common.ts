//---------------------------------------- 生成随机密码密码 ----------------------------------------
export const randomPassword = (length: number) => {
	// Limit length
	if (length < 6) {
		length = 6
	} else if (length > 16) {
		length = 16
	}
	let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()']
	var password = []
	let n = 0
	for (let i = 0; i < length; i++) {
		// If password length less than 9, all value random
		if (password.length < length - 4) {
			// Get random passwordArray index
			let arrayRandom = Math.floor(Math.random() * 4)
			// Get password array value
			let passwordItem = passwordArray[arrayRandom]
			// Get password array value random index
			// Get random real value
			let item = passwordItem[Math.floor(Math.random() * passwordItem.length)]
			password.push(item)
		} else {
			// If password {Size} then 9, lastest 4 password will push in according to the random password index
			// Get the array values sequentially
			let newItem = passwordArray[n]
			let lastItem = newItem[Math.floor(Math.random() * newItem.length)]
			// Get array splice index
			let spliceIndex = Math.floor(Math.random() * password.length)
			password.splice(spliceIndex, 0, lastItem)
			n++
		}
	}
	return password.join('')
}
//---------------------------------------- 获取字典 ----------------------------------------
type dictItems = {
	[key: string]: { value: string; text: string; title: string }[]
}
export const getDict = (dictNames: string[], reversal = false) => {
	if (!localStorage.getItem('DictItems')) {
		console.error('字典不存在，请重新登录')
	}
	let dictItems = JSON.parse(localStorage.getItem('DictItems') || '{}') as dictItems
	if (Object.keys(dictItems).length === 0) return {}
	let result = {}
	dictNames.forEach((dictName) => {
		let dictItem = dictItems[dictName]
		// 创建字典
		let dict = {}
		let option: { value: string; label: string }[] = []
		dictItem.forEach(({ value, text }) => {
			if (reversal) {
				dict[text] = value
			} else {
				dict[value] = text
			}
			option.push({ value, label: text })
		})
		result[dictName] = [dict, option]
	})
	return result
}
