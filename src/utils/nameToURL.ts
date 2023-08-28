export const nameToURL = (name: string, defaultURL: string, mini = false) => {
	let res = ''
	const ext = name.split('.').pop()

	switch (ext) {
		case 'doc':
		case 'docx':
			if (mini) {
				res = 'word-icon.jpg'
				break
			}

			res = 'word.jpg'
			break

		case 'xls':
		case 'xlsx':
			if (mini) {
				res = 'excel-icon.png'
				break
			}

			res = 'excel.png'
			break

		case 'pdf':
			if (mini) {
				res = 'pdf-icon.png'
				break
			}

			res = 'pdf.jpg'
			break

		case 'ppt':
		case 'pptx':
			if (mini) {
				res = 'powerpoint-icon.png'
				break
			}

			res = 'powerpoint.jpg'
			break

		case 'txt':
			if (mini) {
				res = 'txt-icon.png'
				break
			}

			res = 'txt.jpg'
			break

		default:
			return defaultURL as string
	}

	return `/images/${res}`
}
