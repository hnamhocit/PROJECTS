export const nameToURL = (name: string, defaultURL: string) => {
	let res = ''
	const ext = name.split('.').pop()

	switch (ext) {
		case 'doc':
		case 'docx':
			res = 'word.webp'
			break

		case 'xls':
		case 'xlsx':
			res = 'excel.png'
			break

		case 'pdf':
			res = 'pdf.png'
			break

		case 'ppt':
		case 'pptx':
			res = 'powerpoint.png'
			break

		case 'txt':
			res = 'txt.png'
			break

		default:
			return defaultURL as string
	}

	return `/images/${res}`
}
