import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FC, memo, useMemo } from 'react'

import { Column } from '@/types/Column'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import AddCard from './AddCard'
import Card from './Card'

interface ColumnContainerProps {
	column: Column
	ownTasks: Task[]
	tasks: Task[]
	tags: string[] | undefined
	members: User[]
	ownerId: string | undefined
}

const ColumnContainer: FC<ColumnContainerProps> = ({
	column,
	ownTasks,
	tasks,
	tags,
	members,
	ownerId,
}) => {
	const ownTaskIds = useMemo(() => {
		return ownTasks.map((task) => task.id) ?? []
	}, [ownTasks])

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		},
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className='p-4 bg-gray-200 shadow-lg rounded-xl opacity-40'></div>
		)
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className='p-4 space-y-5 bg-gray-200 rounded-xl'>
			<div {...attributes} {...listeners} className='font-medium'>
				{column.title} ({ownTasks?.length})
			</div>

			<SortableContext items={ownTaskIds}>
				{ownTasks.map((task) => (
					<Card
						ownerId={ownerId}
						key={task.id}
						tasks={tasks}
						task={task}
						members={members}
					/>
				))}
			</SortableContext>

			<AddCard
				columnId={column.id}
				tags={tags}
				tasks={tasks}
				members={members}
			/>
		</div>
	)
}

export default memo(ColumnContainer)
