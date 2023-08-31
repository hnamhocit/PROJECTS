import clsx from 'clsx'
import { Check } from 'lucide-react'
import { FC, memo } from 'react'

interface CheckboxProps {
	checked: boolean
	onChange: () => void
	disabled?: boolean
}

const Checkbox: FC<CheckboxProps> = ({
	checked,
	onChange,
	disabled = false,
}) => {
	return (
		<button
			disabled={disabled}
			type='button'
			className={clsx(
				'flex items-center justify-center w-5 h-5 border-2 rounded-md transition hover:bg-blue-600 hover:border-blue-600 focus:ring',
				{
					'bg-blue-600 border-blue-600': checked,
				}
			)}
			onClick={onChange}>
			<Check
				size={20}
				className='text-white transition-all'
				style={{
					opacity: checked ? 1 : 0,
					transform: `scale(${checked ? 1 : 0})`,
					visibility: checked ? 'visible' : 'hidden',
				}}
				strokeWidth={4}
			/>
		</button>
	)
}

export default memo(Checkbox)
