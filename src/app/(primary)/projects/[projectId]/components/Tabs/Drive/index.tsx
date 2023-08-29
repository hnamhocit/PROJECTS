import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { FC, memo, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { File as IFile } from '@/types/file'
import { User } from '@/types/user'
import File from './File'
import Upload from './Upload'

interface DriveProps {
	drive: IFile[] | undefined
	ownerId: string | undefined
	members: User[]
}

const itemsPerPage = 15

const Drive: FC<DriveProps> = ({ drive, ownerId, members }) => {
	const [page, setPage] = useState(1)

	const totalPages = useMemo(
		() => Math.ceil((drive?.length as number) / itemsPerPage),
		[drive?.length]
	)

	const displayedItems = useMemo(
		() => drive?.slice((page - 1) * itemsPerPage, page * itemsPerPage),
		[drive, page]
	)

	return (
		<div className='space-y-3'>
			<div className='grid grid-cols-4 gap-3'>
				<Upload drive={drive} />

				{displayedItems?.map((file) => (
					<File
						key={file.id}
						file={file}
						ownerId={ownerId}
						drive={drive}
						members={members}
					/>
				))}
			</div>

			{totalPages > 1 && (
				<div className='flex items-center justify-center gap-3'>
					<Button
						size='icon'
						variant='outline'
						disabled={page === 1}
						onClick={() => setPage(page - 1)}>
						<ChevronsLeft size={20} />
					</Button>

					{/* Danh sách các số trang */}
					{[...Array(totalPages)].map((_, index) => (
						<Button
							size='icon'
							key={index}
							variant={page === index + 1 ? 'primary' : 'outline'}
							onClick={() => setPage(index + 1)}
							disabled={page === index + 1}>
							{index + 1}
						</Button>
					))}

					<Button
						size='icon'
						variant='outline'
						disabled={page === totalPages}
						onClick={() => setPage(page + 1)}>
						<ChevronsRight size={20} />
					</Button>
				</div>
			)}
		</div>
	)
}

export default memo(Drive)
