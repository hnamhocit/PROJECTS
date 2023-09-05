import clsx from 'clsx'
import moment from 'moment'
import { FC, memo, useMemo } from 'react'

import Avatar from '@/components/Avatar'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Message as IMessage } from '@/types/message'
import { User } from '@/types/user'

interface MessageProps {
	message: IMessage
	members: User[]
	messages: IMessage[]
	i: number
}

const Message: FC<MessageProps> = ({ message, members, messages, i }) => {
	const user = useAppSelector(selectUser)

	const sender = useMemo(
		() => members.find((member) => member.uid === message.senderId),
		[members, message.senderId]
	)
	const me = useMemo(
		() => sender?.uid === user?.uid,
		[sender?.uid, user?.uid]
	)
	const prev = messages[i - 1]?.senderId === message.senderId
	const next = messages[i + 1]?.senderId !== message.senderId

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

			<div
				className={clsx('p-3 rounded-xl space-y-1 select-none', {
					'text-right bg-blue-100': me,
					'bg-neutral-100': !me,
				})}>
				{!prev && (
					<div className='text-xs leading-none text-gray-500'>
						{sender?.displayName}
					</div>
				)}

				<div className='text-sm'>{message.content}</div>

				{next && (
					<div className='text-xs leading-none text-gray-500'>
						{moment(message.updatedAt).format('HH:mm')}
					</div>
				)}
			</div>
		</div>
	)
}

export default memo(Message)
