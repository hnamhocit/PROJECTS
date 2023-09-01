import { Plus } from 'lucide-react'
import { ChangeEvent, FC, memo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddSubtaskProps {
	onChange: (content: string) => void
}

const AddSubtask: FC<AddSubtaskProps> = ({ onChange }) => {
	const [content, setContent] = useState('')

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.startsWith(' ')) return
		setContent(e.target.value)
	}

	const handleClick = () => {
		if (content.length === 0) return
		onChange(content)
		setContent('')
	}

	return (
		<div className='flex items-center gap-3'>
			<Input
				placeholder='Enter task...'
				value={content}
				onChange={handleChange}
			/>

			<Button
				type='button'
				variant='secondary'
				size='icon'
				onClick={handleClick}>
				<Plus size={20} />
			</Button>
		</div>
	)
}

export default memo(AddSubtask)
