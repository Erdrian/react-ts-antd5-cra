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
type getDictRes = {
	[key: string]: any[]
}
export const getDict = (dictNames: string[], reversal = false): getDictRes => {
	type dictItemsType = {
		[key: string]: { value: string; text: string; title: string }[]
	}
	let dictItems = JSON.parse(localStorage.getItem('DictItems') || '{}') as dictItemsType
	let result = {}
	dictNames.forEach((dictName) => {
		let dictItem = dictItems[dictName]
		let dict = {}
		let option: { value: string; label: string }[] = []
		if (dictItem) {
			dictItem.forEach(({ value, text }) => {
				// 创建字典
				if (reversal) {
					dict[text] = value
				} else {
					dict[value] = text
				}
				// 创建选项
				option.push({ value, label: text })
			})
		} else {
			console.error(`字典："${dictName}"，解析失败`)
		}
		result[dictName] = [dict, option]
	})
	return result
}
