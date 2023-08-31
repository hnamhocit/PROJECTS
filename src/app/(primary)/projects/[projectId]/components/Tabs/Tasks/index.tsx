import { FC, memo } from 'react'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Task } from '@/types/task'

interface TasksProps {
	tasks: Task[] | undefined
}

const Tasks: FC<TasksProps> = ({ tasks }) => {
	const user = useAppSelector(selectUser)

	return <div>Tasks</div>
}

export default memo(Tasks)
