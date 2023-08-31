import { doc, updateDoc } from 'firebase/firestore'
import { MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'

import DropdownMenu from '@/components/DropdownMenu'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { Task as ITask } from '@/types/task'
import Subtask from '../../../KanbanBoard/ColumnContainer/Subtask'

interface TaskProps {
	task: ITask
	tasks: ITask[]
}

const Task: FC<TaskProps> = ({ task, tasks }) => {
	const [disabled, setDisabled] = useState(false)
	const [deletingDisabled, setDeletingDisabled] = useState(false)
	const [changingDisabled, setChangingDisabled] = useState(false)

	const { toast } = useToast()
	const path = usePathname()
	const projectId = path.split('/')[2]

	const handleDelete = async () => {
		try {
			setDisabled(true)

			await updateDoc(doc(db, 'projects', projectId), {
				tasks: tasks.filter((t) => t.id !== task.id),
				updatedAt: new Date().getTime(),
			})

			setDisabled(false)
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	const handleChangeSubtask = async (id: string) => {
		try {
			setChangingDisabled(true)

			const date = new Date().getTime()
			await updateDoc(doc(db, 'projects', projectId), {
				tasks: tasks.map((t) => {
					if (t.id === task.id) {
						return {
							...t,
							subtasks: t.subtasks.map((sub) => {
								if (sub.id === id) {
									return {
										...sub,
										isComplete: !sub.isComplete,
										updatedAt: date,
									}
								}

								return sub
							}),
						}
					}

					return t
				}),
				updatedAt: date,
			})

			setChangingDisabled(false)
		} catch (e) {
			setChangingDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	const handleDeleteSubtask = async (id: string) => {
		try {
			setDeletingDisabled(true)

			await updateDoc(doc(db, 'projects', projectId), {
				tasks: tasks.map((t) => {
					if (t.id === task.id) {
						return {
							...t,
							subtasks: t.subtasks.filter((sub) => sub.id !== id),
						}
					}

					return t
				}),
				updatedAt: new Date().getTime(),
			})

			setDeletingDisabled(false)
		} catch (e) {
			setDeletingDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<div className='p-4 space-y-2 border rounded-xl'>
			<div className='flex items-center justify-between'>
				<div>
					<div className='text-lg font-semibold'>{task.title}</div>
					<div className='text-gray-500'>{task.description}</div>
				</div>

				<DropdownMenu
					trigger={
						<Button size='icon' variant='ghost'>
							<MoreHorizontal size={20} />
						</Button>
					}>
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem
						disabled={disabled}
						onClick={handleDelete}>
						Delete
					</DropdownMenuItem>
				</DropdownMenu>
			</div>

			<div className='space-y-2'>
				{task.subtasks.map((sub) => (
					<Subtask
						key={sub.id}
						subtask={sub}
						deletingDisabled={deletingDisabled}
						changingDisabled={changingDisabled}
						onChange={() => handleChangeSubtask(sub.id)}
						onDelete={() => handleDeleteSubtask(sub.id)}
					/>
				))}
			</div>
		</div>
	)
}

export default memo(Task)
