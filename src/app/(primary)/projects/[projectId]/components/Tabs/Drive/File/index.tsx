import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'

import Dialog from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { db, storage } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { File as IFile } from '@/types/file'
import { User } from '@/types/user'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'
import Detail from './Detail'
import Edit from './Edit'

interface FileProps {
	file: IFile
	ownerId: string | undefined
	drive: IFile[] | undefined
	members: User[]
}

const File: FC<FileProps> = ({ file, ownerId, drive, members }) => {
	const [disabled, setDisabled] = useState(false)
	const [edit, setEdit] = useState(false)
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

	const toggleEdit = () => setEdit(!edit)

	return (
		<Dialog
			trigger={
				<button className='flex items-center gap-3 p-3 transition border rounded-md hover:-translate-y-2 hover:shadow-lg'>
					<div className='shrink-0'>
						<Image
							src={nameToURL(file.name)}
							alt={file.name}
							width={40}
							height={40}
							className='object-contain w-10 h-10'
						/>
					</div>

					<div className='flex-1 text-left'>
						<div className='font-medium text-gray-700 line-clamp-1'>
							{!file.hidden && file.name}
						</div>

						<div className='text-sm text-gray-500'>
							{readableFileSize(file.size)}
						</div>
					</div>
				</button>
			}
			header={
				<DialogTitle>
					{!file.hidden || file.uploadedBy === user?.uid
						? file.name
						: 'Content has been hidden'}
				</DialogTitle>
			}>
			{edit ? (
				<Edit file={file} drive={drive} onClose={toggleEdit} />
			) : (
				<div className='space-y-3'>
					<Detail file={file} members={members} />

					{(file.uploadedBy === user?.uid ||
						user?.uid === ownerId) && (
						<div className='flex gap-3'>
							<Button
								onClick={toggleEdit}
								variant='primary'
								className='flex-1'>
								Edit
							</Button>

							<Button
								disabled={disabled}
								variant='destructive'
								className='flex-1'
								onClick={handleDelete}>
								Delete
							</Button>
						</div>
					)}
				</div>
			)}
		</Dialog>
	)
}

export default memo(File)
