export default function getColorFromImage(imageURL: string): Promise<number[]> {
	const image = new Image()
	image.crossOrigin = 'Anonymous'

	return new Promise((resolve, reject) => {
		image.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Failed to create canvas context'))
				return
			}

			canvas.width = image.width
			canvas.height = image.height

			ctx.drawImage(image, 0, 0)

			const imageData = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			)
			const pixels = imageData.data
			const pixelCount = pixels.length
			const colorMap: { [key: string]: number } = {}

			for (let i = 0; i < pixelCount; i += 4) {
				const red = pixels[i]
				const green = pixels[i + 1]
				const blue = pixels[i + 2]
				const alpha = pixels[i + 3]

				if (alpha >= 125) {
					const rgb = [red, green, blue].join(',')

					if (colorMap[rgb]) {
						colorMap[rgb] += 1
					} else {
						colorMap[rgb] = 1
					}
				}
			}

			const maxCount = Math.max(...Object.values(colorMap))
			const mainColor = Object.keys(colorMap).find(
				(key) => colorMap[key] === maxCount
			)

			if (mainColor) {
				const mainColorArray = mainColor
					.split(',')
					.map((value) => parseInt(value))

				resolve(mainColorArray)
			} else {
				reject(new Error('Failed to find main color'))
			}
		}

		image.onerror = (error) => {
			reject(error)
		}

		image.src = imageURL
	})
}
