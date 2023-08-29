import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'

import Dialog from '@/components/Dialog'
import DropdownMenu from '@/components/DropdownMenu'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { db, storage } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { File as IFile } from '@/types/file'
import { User } from '@/types/user'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'
import Detail from './Detail'

interface FileProps {
	file: IFile
	ownerId: string | undefined
	drive: IFile[] | undefined
	members: User[]
}

const File: FC<FileProps> = ({ file, ownerId, drive, members }) => {
	const [disabled, setDisabled] = useState(false)
	const { toast } = useToast()

	const user = useAppSelector(selectUser)
	const path = usePathname()

	const handleDelete = async () => {
		try {
			if (file.uploadedBy !== user?.uid || file.uploadedBy !== ownerId) {
				toast({
					variant: 'destructive',
					description: 'The performer is not the owner or creator!',
				})
				return
			}

			setDisabled(true)

			const projectId = path.split('/')[2]
			const date = new Date().getTime()

			// delete file in storage and firebase
			await deleteObject(
				ref(storage, `/projects/${projectId}/${file.name}`)
			)
			await updateDoc(doc(db, 'projects', projectId), {
				drive: drive?.filter((f) => f.id !== file.id),
				updatedAt: date,
			})

			setDisabled(false)
		} catch (e) {
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<Dialog
			trigger={
				<div className='flex items-center justify-between p-3 transition border rounded-md hover:-translate-y-2 hover:shadow-lg'>
					<div className='flex items-center flex-1 gap-3'>
						<div className='shrink-0'>
							<Image
								src={nameToURL(file.name)}
								alt={file.name}
								width={48}
								height={48}
								className='object-contain w-12 h-12'
							/>
						</div>

						<div>
							<div className='font-medium text-gray-700 line-clamp-1'>
								{file.name}
							</div>

							<div className='text-sm text-gray-500'>
								{readableFileSize(file.size)}
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

						<DropdownMenuItem
							disabled={disabled}
							onClick={handleDelete}
							className='text-red-600 hover:!bg-red-600 hover:!text-white'>
							Delete
						</DropdownMenuItem>
					</DropdownMenu>
				</div>
			}
			header={<DialogTitle>{file.name}</DialogTitle>}>
			<Detail file={file} members={members} />
		</Dialog>
	)
}

export default memo(File)
