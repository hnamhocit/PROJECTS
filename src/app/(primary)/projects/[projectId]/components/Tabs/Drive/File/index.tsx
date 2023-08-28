import { Settings } from 'lucide-react'
import moment from 'moment'
import { FC, memo } from 'react'

import { Button } from '@/components/ui/button'
import { File as IFile } from '@/types/file'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'

const File: FC<IFile> = ({
	name,
	updatedAt,
	createdAt,
	downloadURL,
	hidden,
	size,
}) => {
	return (
		<div className='transition border rounded-xl hover:shadow-xl hover:scale-110'>
			<div
				className='h-40 bg-center bg-no-repeat bg-cover rounded-t-xl'
				style={{
					backgroundImage: `url(${
						hidden
							? '/images/sensitive-content.avif'
							: nameToURL(name, downloadURL)
					})`,
				}}></div>

			<div className='relative p-3 border-t-2'>
				<div>
					<div className='text-lg font-medium leading-tight text-gray-700'>
						{hidden ? 'Content has been hidden' : name}
					</div>

					<div className='mt-2 text-sm text-gray-500'>
						<div>Size: {readableFileSize(size)}</div>

						<div>
							Created: {moment(createdAt).format('DD.MM.YYYY')}
						</div>

						<div>
							Uploaded: {moment(updatedAt).format('DD.MM.YYYY')}
						</div>
					</div>
				</div>

				<div className='absolute bottom-3 right-3'>
					<Button size='icon' variant='ghost'>
						<Settings size={20} />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default memo(File)
