import { Send } from 'lucide-react'
import { ChangeEvent, FC, memo, useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Message } from '@/types/message'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

interface ComposerProps {
	messages: Message[] | undefined
}

const Composer: FC<ComposerProps> = ({ messages }) => {
	const [disabled, setDisabled] = useState(false)
	const [content, setContent] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const user = useAppSelector(selectUser)
	const path = usePathname()
	const { toast } = useToast()

	const handleSend = useCallback(async () => {
		try {
			setDisabled(true)

			const date = new Date().getTime()
			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				messages: [
					...(messages || []),
					{
						id: uuidv4(),
						content,
						seenBy: [],
						senderId: user?.uid,
						recall: false,
						createdAt: date,
						updatedAt: date,
					},
				],
				updatedAt: date,
			})

			setContent('')
			setDisabled(false)
			inputRef.current?.focus()
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}, [content, messages, path, toast, user?.uid])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.startsWith(' ')) return
		setContent(e.target.value)
	}

	return (
		<div className='absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-4 bg-white border-t h-14'>
			<input
				ref={inputRef}
				type='text'
				className='flex-1 outline-none'
				placeholder='Enter message...'
				value={content}
				onChange={handleChange}
			/>

			<Button
				disabled={disabled}
				size='icon'
				variant='primary'
				onClick={handleSend}>
				<Send size={20} />
			</Button>
		</div>
	)
}

export default memo(Composer)
