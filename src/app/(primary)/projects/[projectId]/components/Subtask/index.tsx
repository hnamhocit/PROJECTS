import clsx from 'clsx'
import { X } from 'lucide-react'
import { FC, memo } from 'react'

import Checkbox from '@/components/Checkbox'
import { Button } from '@/components/ui/button'
import { Subtask } from '@/types/task'

interface SubtaskProps {
	subtask: Subtask
	changingDisabled?: boolean
	deletingDisabled?: boolean
	onChange: () => void | Promise<void>
	onDelete: () => void | Promise<void>
}

const Subtask: FC<SubtaskProps> = ({
	subtask,
	onChange,
	onDelete,
	changingDisabled = false,
	deletingDisabled = false,
}) => {
	return (
		<div className='flex items-center gap-4 p-3 transition bg-blue-50 rounded-xl hover:bg-blue-100'>
			<Checkbox
				disabled={changingDisabled}
				checked={subtask.isComplete}
				onChange={onChange}
			/>

			<p
				className={clsx(
					'flex-1 font-semibold transition-all text-gray-700',
					{
						'line-through !text-gray-400': subtask.isComplete,
					}
				)}>
				{subtask.content}
			</p>

			<Button
				disabled={deletingDisabled}
				variant='ghost'
				size='icon'
				onClick={onDelete}>
				<X size={16} />
			</Button>
		</div>
	)
}

export default memo(Subtask)
