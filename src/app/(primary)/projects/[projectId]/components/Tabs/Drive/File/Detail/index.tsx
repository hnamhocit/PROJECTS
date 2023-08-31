import moment from 'moment'
import Link from 'next/link'
import { FC, memo, useState } from 'react'
import { createPortal } from 'react-dom'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { File } from '@/types/file'
import { User } from '@/types/user'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'

interface DetailProps {
	file: File
	members: User[]
}

const Detail: FC<DetailProps> = ({ file, members }) => {
	const [zoom, setZoom] = useState(false)
	const toggleZoom = () => setZoom((prevZoom) => !prevZoom)

	const user = useAppSelector(selectUser)
	const {
		name,
		download,
		downloadURL,
		hidden,
		createdAt,
		updatedAt,
		uploadedBy,
		size,
	} = file

	const style = {
		backgroundImage: `url("${
			!hidden || uploadedBy === user?.uid
				? nameToURL(name, downloadURL)
				: '/images/sensitive-content.avif'
		}")`,
	}

	return (
		<div>
			{createPortal(
				zoom && (
					<div
						className='fixed inset-0 z-[9999] bg-[rgba(0,0,0,.7)] cursor-zoom-out bg-center bg-no-repeat bg-contain'
						onClick={toggleZoom}
						style={style}></div>
				),
				document.body
			)}

			<div className='space-y-3'>
				<div
					onClick={toggleZoom}
					className='transition bg-center bg-no-repeat bg-contain cursor-zoom-in h-60 rounded-xl'
					style={style}></div>

				<div className='text-sm leading-tight'>
					{!hidden || uploadedBy === user?.uid ? (
						<>
							<div>Size: {readableFileSize(size)}</div>

							{download && (
								<div className='line-clamp-1'>
									Download:{' '}
									<Link
										href={downloadURL}
										download
										className='text-blue-600 underline'>
										Click here
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

							<div>
								Created At:{' '}
								{moment(createdAt).format('DD.MM.YYYY')}
							</div>

							<div>
								Updated At:{' '}
								{moment(updatedAt).format('DD.MM.YYYY')}
							</div>
						</>
					) : (
						'Content has been hidden'
					)}
				</div>
			</div>
		</div>
	)
}

export default memo(Detail)
