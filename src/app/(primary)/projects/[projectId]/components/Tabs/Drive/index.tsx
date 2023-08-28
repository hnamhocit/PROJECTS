import { FC, memo } from 'react'

import { File as IFile } from '@/types/file'
import File from './File'
import Upload from './Upload'

export interface DriveProps {
	drive: IFile[] | undefined
}

const Drive: FC<DriveProps> = ({ drive }) => {
	return (
		<div className='grid grid-cols-4 gap-3'>
			{drive?.map((file) => (
				<File key={file.id} {...file} />
			))}

			<Upload drive={drive} />
		</div>
	)
}

export default memo(Drive)
