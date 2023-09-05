import clsx from 'clsx'
import moment from 'moment'
import { FC, memo, useCallback, useMemo, useState } from 'react'

import Avatar from '@/components/Avatar'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Message as IMessage } from '@/types/message'
import { User } from '@/types/user'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'

interface MessageProps {
	message: IMessage
	members: User[]
	messages: IMessage[]
	i: number
}

const Message: FC<MessageProps> = ({ message, members, messages, i }) => {
	const [disabled, setDisabled] = useState({
		recall: false,
		delete: false,
	})

	const { toast } = useToast()
	const user = useAppSelector(selectUser)
	const path = usePathname()

	const toggleDisabled = useCallback((key: keyof typeof disabled) => {
		setDisabled((prevDisabled) => ({
			...prevDisabled,
			[key]: !prevDisabled[key],
		}))
	}, [])

	const projectId = useMemo(() => path.split('/')[2], [path])
	const sender = useMemo(
		() => members.find((member) => member.uid === message.senderId),
		[members, message.senderId]
	)
	const me = useMemo(
		() => sender?.uid === user?.uid,
		[sender?.uid, user?.uid]
	)
	const prev = useMemo(
		() => messages[i - 1]?.senderId === message.senderId,
		[message.senderId, messages, i]
	)
	const next = useMemo(
		() => messages[i + 1]?.senderId !== message.senderId,
		[message.senderId, messages, i]
	)

	const handleDelete = useCallback(async () => {
		try {
			toggleDisabled('delete')

			await updateDoc(doc(db, 'projects', projectId), {
				messages: messages.filter((m) => m.id !== message.id),
				updatedAt: new Date().getTime(),
			})

			toggleDisabled('delete')
		} catch (e) {
			setDisabled((prevDisabled) => ({ ...prevDisabled, delete: false }))
			toast({
				variant: 'destructive',
				description: (e as Error).message,
			})
		}
	}, [messages, toast, toggleDisabled, message.id, projectId])

	const handleRecall = useCallback(async () => {
		try {
			toggleDisabled('recall')

			const date = new Date().getTime()
			await updateDoc(doc(db, 'projects', projectId), {
				messages: messages.map((m) => {
					if (m.id === message.id) {
						return {
							...m,
							recall: !m.recall,
							updatedAt: date,
						}
					}

					return m
				}),
				updatedAt: date,
			})

			toggleDisabled('recall')
		} catch (e) {
			setDisabled((prevDisabled) => ({ ...prevDisabled, recall: false }))
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}, [message.id, messages, toast, projectId, toggleDisabled])

	return (
		<div
			className={clsx('flex gap-3', {
				'flex-row-reverse': me,
			})}>
			<div className='w-10 h-10 shrink-0'>
				{!prev && (
					<Avatar src={sender?.photoURL} alt={sender?.displayName} />
				)}
			</div>
			<ContextMenu>
				<ContextMenuTrigger>
					<div
						className={clsx(
							'p-3 rounded-xl space-y-1 select-none',
							{
								'text-right bg-blue-100': me,
								'bg-neutral-100': !me,
							}
						)}>
						{!prev && (
							<div className='text-xs leading-none text-gray-500'>
								{sender?.displayName}
							</div>
						)}

						<div className='text-sm'>
							{message.recall
								? 'Message has been recalled.'
								: message.content}
						</div>

						{next && (
							<div className='text-xs leading-none text-gray-500'>
								{moment(message.createdAt).format('HH:mm')}
							</div>
						)}
					</div>
				</ContextMenuTrigger>

				<ContextMenuContent className='space-y-1'>
					<ContextMenuItem
						disabled={disabled.recall}
						className='text-red-600 hover:!text-white hover:!bg-red-600'
						onClick={handleRecall}>
						{message.recall ? 'Cancel recall' : 'Recall'}
					</ContextMenuItem>

					<ContextMenuItem
						disabled={disabled.delete}
						className='!text-white bg-red-600 hover:!bg-red-700'
						onClick={handleDelete}>
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	)
}

export default memo(Message)
