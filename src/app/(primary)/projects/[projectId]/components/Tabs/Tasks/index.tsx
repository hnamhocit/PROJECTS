import { FC, memo } from 'react'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Task as ITask } from '@/types/task'
import Task from './Task'

interface TasksProps {
	tasks: ITask[] | undefined
	tags: string[] | undefined
	assignedFor?: boolean
}

const Tasks: FC<TasksProps> = ({ tasks, tags, assignedFor = true }) => {
	const user = useAppSelector(selectUser)
	const cols = [
		{
			title: 'To Do',
			tasks: tasks?.filter((task) =>
				assignedFor
					? task.columnId === 'todo' &&
					  task.assignedFor.includes(user?.uid as string)
					: task.columnId === 'todo'
			),
		},
		{
			title: 'In Progress',
			tasks: tasks?.filter((task) =>
				assignedFor
					? task.columnId === 'inProgress' &&
					  task.assignedFor.includes(user?.uid as string)
					: task.columnId === 'inProgress'
			),
		},
		{
			title: 'Done',
			tasks: tasks?.filter((task) =>
				assignedFor
					? task.columnId === 'done' &&
					  task.assignedFor.includes(user?.uid as string)
					: task.columnId === 'done'
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
