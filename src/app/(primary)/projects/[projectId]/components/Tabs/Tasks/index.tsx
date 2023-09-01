import { FC, memo } from 'react'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Task as ITask } from '@/types/task'
import Task from './Task'

interface TasksProps {
	tasks: ITask[] | undefined
	tags: string[] | undefined
}

const Tasks: FC<TasksProps> = ({ tasks, tags }) => {
	const user = useAppSelector(selectUser)
	const cols = [
		{
			title: 'To Do',
			tasks: tasks?.filter(
				(task) =>
					task.columnId === 'todo' &&
					task.assignedFor.includes(user?.uid as string)
			),
		},
		{
			title: 'In Progress',
			tasks: tasks?.filter(
				(task) =>
					task.columnId === 'inProgress' &&
					task.assignedFor.includes(user?.uid as string)
			),
		},
		{
			title: 'Done',
			tasks: tasks?.filter(
				(task) =>
					task.columnId === 'done' &&
					task.assignedFor.includes(user?.uid as string)
			),
		},
	]

	return (
		<div className='space-y-5'>
			{cols.map(
				(col) =>
					(col.tasks?.length as number) > 0 && (
						<div key={col.title} className='space-y-2'>
							<div className='text-lg font-semibold'>
								{col.title}
							</div>
							{col.tasks?.map((task) => (
								<Task
									key={task.id}
									task={task}
									tasks={tasks}
									tags={tags}
								/>
							))}
						</div>
					)
			)}
		</div>
	)
}

export default memo(Tasks)
