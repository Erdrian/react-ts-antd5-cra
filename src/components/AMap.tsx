import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { message } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
type AmapProps = {
	loadOptions?: any
	initOptions?: AMap.MapOptions
	onMapLoad?: Function
	mapEvents?: { event: string; handleEvent: Function }[]
	draw?: boolean
}
export const getMap = (callback: (map: any, AMap: any) => void, ref_AMap: any) => {
	const map = ref_AMap.current?.map.current
	const AMap = ref_AMap.current?.AMap.current
	if (map && AMap) {
		callback(map, AMap)
	} else {
		message.error('地图尚未加载完成，请稍后重试')
	}
}
export default forwardRef<any, AmapProps>((props: AmapProps, ref) => {
	const mapRef = useRef(null)
	const MapRef = useRef(null)
	let { loadOptions, initOptions, onMapLoad, mapEvents } = props
	useEffect(() => {
		let map: any = null
		AMapLoader.load({
			key: '69ae0f377d456e347cc256411ed79b22', // 申请好的Web端开发者Key，首次调用 load 时必填
			version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
			resizeEnable: true,
			...loadOptions,
		})
			.then((AMap) => {
				map = new AMap.Map('amap-container', {
					zoom: 10,
					center: [117.39, 39.9],
					mapStyle: 'amap://styles/whitesmoke',
					...initOptions,
				})
				// 传递出map和Map
				mapRef.current = map
				MapRef.current = AMap
				// 地图初始化函数
				onMapLoad?.(map, AMap)
				// 地图事件绑定
				if (mapEvents) {
					mapEvents.forEach((ele) => {
						let { event, handleEvent } = ele
						map.on(event, (e: any) => {
							handleEvent(e, map, AMap)
						})
					})
				}
			})
			.catch((e) => {
				console.log(e)
			})
		return () => {
			map && map.destroy()
		}
	}, [loadOptions, initOptions, onMapLoad, mapEvents])
	useImperativeHandle(ref, () => ({ map: mapRef, AMap: MapRef }))
	return (
		<div
			id='amap-container'
			style={{ width: '100%', margin: 0, padding: 0, height: '100%', position: 'relative' }}
		></div>
	)
})
