import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { doc, updateDoc } from 'firebase/firestore'
import { Calendar, ListTodo } from 'lucide-react'
import moment from 'moment'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'

import AvatarGroup from '@/components/AvatarGroup'
import Dialog from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Subtask as ISubtask, Task } from '@/types/task'
import { User } from '@/types/user'
import Subtask from '../Subtask'

interface CardProps {
	tasks: Task[]
	task: Task
	members: User[]
	ownerId: string | undefined
}

const Card: FC<CardProps> = ({ task, members, tasks, ownerId }) => {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
	})
	const { toast } = useToast()
	const [deleting, setDeleting] = useState(false)
	const user = useAppSelector(selectUser)
	const path = usePathname()

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	const handleChange = async (sub: ISubtask) => {
		try {
			const date = new Date().getTime()

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				tasks: tasks.map((task) => {
					return {
						...task,
						subtasks: task.subtasks.map((s) => {
							if (s.id === sub.id) {
								return {
									...sub,
									isComplete: !sub.isComplete,
									updatedAt: date,
								}
							}

							return s
						}),
					}
				}),
				updatedAt: date,
			})
		} catch (e) {
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	const handleDelete = async () => {
		try {
			setDeleting(true)

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				tasks: tasks.filter((t) => t.id !== task.id),
				updatedAt: new Date().getTime(),
			})

			setDeleting(false)
		} catch (e) {
			toast({ variant: 'destructive', description: (e as Error).message })
			setDeleting(false)
		}
	}

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className='p-4 bg-white rounded-xl min-h-[160px] opacity-40'></div>
		)
	}

	return (
		<Dialog
			header={<DialogTitle>{task.title}</DialogTitle>}
			trigger={
				<div
					ref={setNodeRef}
					style={style}
					{...attributes}
					{...listeners}
					className='p-4 space-y-5 bg-white rounded-xl'>
					<div>
						<div className='font-semibold'>{task.title}</div>

						<div className='flex items-center justify-between'>
							<div className='px-2 py-1 text-sm bg-gray-200 rounded-md'>
								{task.tag}
							</div>

							<AvatarGroup
								data={members.filter((member) =>
									task.assignedFor.includes(member.uid)
								)}
							/>
						</div>
					</div>

					<div className='h-1 rounded-full bg-neutral-100'></div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-sm text-gray-500'>
							<ListTodo size={20} />

							<span>
								{
									task.subtasks.filter(
										(detail) => detail.isComplete
									).length
								}{' '}
								/ {task.subtasks.length}
							</span>
						</div>

						<div className='flex items-center gap-2 text-sm text-gray-500'>
							<Calendar size={20} />
							<span>
								{moment(task.updatedAt).format('DD.MM.YYYY')}
							</span>
						</div>
					</div>
				</div>
			}>
			<div className='space-y-3'>
				<p className='text-sm text-gray-500'>{task.description}</p>

				<div className='space-y-2'>
					{task.subtasks.map((sub) => (
						<Subtask
							key={sub.id}
							subtask={sub}
							onChange={() => handleChange(sub)}
						/>
					))}
				</div>

				{(task.assignedFor.includes(user?.uid as string) ||
					user?.uid === ownerId) && (
					<div className='flex justify-end gap-3'>
						<Button variant='primary' className='flex-1'>
							Edit
						</Button>

						<Button
							disabled={deleting}
							variant='destructive'
							className='flex-1'
							onClick={handleDelete}>
							Delete
						</Button>
					</div>
				)}
			</div>
		</Dialog>
	)
}

export default memo(Card)
