import { FC, memo } from 'react'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Task as ITask } from '@/types/task'
import Task from './Task'

interface TasksProps {
	tasks: ITask[] | undefined
}

const Tasks: FC<TasksProps> = ({ tasks }) => {
	const user = useAppSelector(selectUser)

	return (
		<div className='space-y-5'>
			{tasks
				?.filter((task) =>
					task.assignedFor.includes(user?.uid as string)
				)
				.map((task) => (
					<Task key={task.id} task={task} tasks={tasks} />
				))}
		</div>
	)
}

export default memo(Tasks)
