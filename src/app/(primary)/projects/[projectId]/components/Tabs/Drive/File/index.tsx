import { MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { FC, memo } from 'react'

import DropdownMenu from '@/components/DropdownMenu'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { File as IFile } from '@/types/file'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'

const File: FC<IFile> = ({ name, downloadURL, hidden, size }) => {
	return (
		<div className='flex items-center justify-between p-3 transition border rounded-md hover:-translate-y-2 hover:shadow-lg'>
			<div className='flex items-center flex-1 gap-3'>
				<div>
					<Image
						src={
							hidden
								? '/images/sensitive-content.avif'
								: nameToURL(name, downloadURL)
						}
						alt={name}
						width={48}
						height={48}
						className='object-contain w-12 h-12 rounded-md'
					/>
				</div>

				<div>
					<div className='font-medium text-gray-700 line-clamp-1'>
						{name}
					</div>
					<div className='text-sm text-gray-500'>
						{readableFileSize(size)}
					</div>
				</div>
			</div>

			<DropdownMenu
				trigger={
					<Button size='icon' variant='ghost'>
						<MoreVertical size={20} />
					</Button>
				}>
				<DropdownMenuItem className='text-blue-600 hover:!bg-blue-600 hover:!text-white'>
					Edit
				</DropdownMenuItem>

				<DropdownMenuItem className='text-red-600 hover:!bg-red-600 hover:!text-white'>
					Delete
				</DropdownMenuItem>
			</DropdownMenu>
		</div>
	)
}

export default memo(File)
