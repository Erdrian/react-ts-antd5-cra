import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'
//----------------------------------------  ----------------------------------------
// type test  =  typeof provinces[number]
const valueProcess = (code: string) => (code + '000000').slice(0, 6)
const divisionOptions = () => {
	areas.forEach((area) => {
		const matchCity = cities.filter((city) => city.code === area.cityCode)[0] as any
		if (matchCity) {
			matchCity.children = matchCity.children || []
			matchCity.children.push({
				label: area.name,
				value: area.code,
			})
		}
	})
	cities.forEach((city: any) => {
		const matchProvince = provinces.filter((province) => province.code === city.provinceCode)[0] as any
		if (matchProvince) {
			matchProvince.children = matchProvince.children || []
			matchProvince.children.push({
				label: city.name,
				value: valueProcess(city.code),
				children: city.children,
			})
		}
	})
	const options = provinces.map((province: any) => ({
		label: province.name,
		value: valueProcess(province.code),
		children: province.children,
	}))
	return options
}
export default divisionOptions() || []
