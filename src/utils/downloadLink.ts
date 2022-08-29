export default (data: Blob | MediaSource, filename: string) => {
	let a = document.createElement('a')
	let url = window.URL.createObjectURL(data)
	console.log(url)
	a.href = url
	a.setAttribute('download', filename)
	a.click()
	window.URL.revokeObjectURL(url)
	a.remove()
}
