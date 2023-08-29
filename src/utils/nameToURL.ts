export const nameToURL = (name: string, defaultURL?: string) => {
	let res = ''
	const ext = name.split('.').pop()

	switch (ext) {
		case 'doc':
		case 'docx':
			res = 'doc.png'
			break

		case 'xls':
		case 'xlsx':
			res = 'xls.png'
			break

		case 'pdf':
			res = 'pdf.png'
			break

		case 'ppt':
		case 'pptx':
			res = 'ppt.png'
			break

		case 'avi':
		case 'mov':
		case 'mp4':
		case 'ogg':
		case 'wmv':
		case 'webm':
			res = 'video.png'
			break

		case 'mp3':
		case 'wav':
		case 'ogg':
			res = 'audio.png'
			break

		case 'jpg':
		case 'png':
		case 'gif':
		case 'tff':
		case 'ico':
		case 'svg':
		case 'webp':
			if (defaultURL) {
				return defaultURL
			}

			res = 'image.png'
			break

		default:
			res = 'file.png'
	}

	return `/images/${res}`
}
