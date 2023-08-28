import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Dot } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Dialog from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { db, storage } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { File as IFile } from '@/types/file'
import { nameToURL } from '@/utils/nameToURL'
import { readableFileSize } from '@/utils/readableFileSize'
import File from './File'

const Drive = ({ drive }: { drive: IFile[] | undefined }) => {
	const [blobs, setBlobs] = useState<string[]>([])
	const [uploaded, setUploaded] = useState(0)
	const [files, setFiles] = useState<FileList>()
	const { toast } = useToast()

	const inputRef = useRef<HTMLInputElement>(null)
	const path = usePathname()
	const user = useAppSelector(selectUser)

	const handleChange = function (e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault()

		if (e.target.files && e.target.files[0]) {
			const files = e.target.files
			const blobs = Array.from(files).map((file) => {
				return URL.createObjectURL(file)
			})

			setBlobs(blobs)
			setFiles(files)
			handleFiles(files)
		}
	}

	const handleFiles = async (files: FileList) => {
		try {
			const results: IFile[] = []
			const date = new Date().getTime()

			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				const id = uuidv4()
				const fileRef = ref(
					storage,
					`/projects/${path.split('/')[2]}/${file.name}`
				)

				await uploadBytes(fileRef, file)
				const downloadURL = await getDownloadURL(fileRef)

				// add to results and calc items uploaded
				results.push({
					id,
					downloadURL,
					name: file.name,
					size: file.size,
					hidden: false,
					download: true,
					uploadedBy: user?.uid as string,
					createdAt: date,
					updatedAt: date,
				})
				setUploaded(results.length)
			}

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				drive: [...(drive ?? []), ...results],
				updatedAt: date,
			})

			setBlobs([])
			setUploaded(0)
			setFiles(undefined)
		} catch (e) {
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	useEffect(() => {
		return () => {
			blobs.forEach((blob) => URL.revokeObjectURL(blob))
		}
	}, [blobs])

	return (
		<div className='grid grid-cols-4 gap-5'>
			{drive?.map((file) => (
				<File key={file.id} {...file} />
			))}

			<Dialog
				trigger={<Button>Upload file</Button>}
				header={<DialogTitle>Upload File</DialogTitle>}>
				<div className='space-y-5'>
					<button
						className='flex items-center justify-center w-full p-6 transition border-2 border-dashed rounded-xl hover:border-blue-500 hover:text-blue-500'
						onClick={() => inputRef.current?.click()}>
						<input
							ref={inputRef}
							type='file'
							onChange={handleChange}
							multiple
							hidden
						/>

						<div className='space-y-3 text-center'>
							<Image
								src='/images/upload.png'
								alt='Upload icon'
								width={64}
								height={64}
								className='mx-auto'
							/>

							<div className='text-xl font-medium'>UPLOAD</div>

							<p className='text-sm text-gray-500'>
								Maximum file size 50mb
							</p>
						</div>
					</button>

					<div className='font-semibold'>Uploaded file</div>

					<div>
						{Array.from(files ?? []).map((file, i) => (
							<div
								key={file.name}
								className='flex items-center gap-3'>
								<Image
									src={nameToURL(file.name, blobs[i], true)}
									alt={file.name}
									width={40}
									height={40}
									className='object-cover w-10 h-10 rounded-md'
								/>

								<div>
									<div className='font-medium'>
										{file.name}
									</div>

									<div className='flex items-center gap-1 text-sm text-gray-500'>
										<div>{readableFileSize(file.size)}</div>

										<Dot />

										<div className='uppercase'>
											{i + 1 > uploaded
												? 'Uploading...'
												: 'Uploaded'}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</Dialog>
		</div>
	)
}

export default memo(Drive)