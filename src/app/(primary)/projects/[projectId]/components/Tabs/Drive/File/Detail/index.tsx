import { FC, memo, useState } from 'react'
import { createPortal } from 'react-dom'

import { File } from '@/types/file'
import { User } from '@/types/user'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'
import moment from 'moment'
import Link from 'next/link'

interface DetailProps {
	file: File
	members: User[]
}

const Detail: FC<DetailProps> = ({
	file: {
		name,
		download,
		downloadURL,
		hidden,
		createdAt,
		updatedAt,
		uploadedBy,
		size,
	},
	members,
}) => {
	const [zoom, setZoom] = useState(false)
	const toggleZoom = () => setZoom(!zoom)

	const style = {
		backgroundImage: `url(${
			hidden
				? '/images/sensitive-content.avif'
				: nameToURL(name, downloadURL)
		})`,
	}

	return (
		<div className='space-y-3'>
			{createPortal(
				<>
					{zoom && (
						<div
							className='fixed inset-0 z-[9999] bg-[rgba(0,0,0,.7)] cursor-pointer'
							onClick={toggleZoom}>
							<div
								className='w-full h-full bg-center bg-no-repeat bg-contain rounded-xl'
								style={style}></div>
						</div>
					)}
				</>,
				document.body
			)}

			<div
				onClick={() => setZoom(!zoom)}
				className='transition bg-center bg-no-repeat bg-contain cursor-pointer h-60 rounded-xl'
				style={style}></div>

			<div>
				<div className='mb-1 text-lg font-medium'>File Information</div>

				<div className='text-sm'>
					{hidden ? (
						'Content has been hidden'
					) : (
						<>
							<div>Size: {readableFileSize(size)}</div>

							<div>
								Created At:{' '}
								{moment(createdAt).format('DD.MM.YYYY')}
							</div>

							<div>
								Updated At:{' '}
								{moment(updatedAt).format('DD.MM.YYYY')}
							</div>

							{download && (
								<div className='line-clamp-1'>
									Download:{' '}
									<Link
										href={downloadURL}
										download
										className='text-blue-600 underline'>
										{downloadURL}
									</Link>
								</div>
							)}

							<div>
								Uploaded by:{' '}
								{
									members.find(
										(member) => member.uid === uploadedBy
									)?.displayName
								}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default memo(Detail)
