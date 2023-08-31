import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { Column, ColumnId } from '@/types/Column'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import ColumnContainer from './ColumnContainer'
import Card from './ColumnContainer/Card'

interface KanbanBoardProps {
	tags: string[] | undefined
	data: Task[] | undefined
	members: User[]
	ownerId: string | undefined
}

const defaultCols: Column[] = [
	{
		id: 'todo',
		title: 'To Do',
	},
	{
		id: 'inProgress',
		title: 'In Progress',
	},
	{
		id: 'done',
		title: 'Done',
	},
]

const KanbanBoard: FC<KanbanBoardProps> = ({
	data,
	members,
	tags,
	ownerId,
}) => {
	const [columns, setColumns] = useState(defaultCols)
	const [tasks, setTasks] = useState<Task[]>([])
	const [activeCol, setActiveCol] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const { toast } = useToast()

	const path = usePathname()
	const columnIds = useMemo(() => columns.map((col) => col.id), [columns])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		})
	)

	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === 'Column') {
			setActiveCol(event.active.data.current.column)
			return
		}

		if (event.active.data.current?.type === 'Task') {
			setActiveTask(event.active.data.current.task)
			return
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveCol(null)
		setActiveTask(null)

		const { active, over } = event
		if (!over) return

		const activeId = active.id
		const overId = over.id

		if (activeId === overId) return

		const isActiveAColumn = active.data.current?.type === 'Column'
		if (!isActiveAColumn) return

		console.log('DRAG END')

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex(
				(col) => col.id === activeId
			)

			const overColumnIndex = columns.findIndex(
				(col) => col.id === overId
			)

			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return

		const activeId = active.id
		const overId = over.id

		if (activeId === overId) return

		const isActiveATask = active.data.current?.type === 'Task'
		const isOverATask = over.data.current?.type === 'Task'

		if (!isActiveATask) return

		// Im dropping a Task over another Task
		if (isActiveATask && isOverATask) {
			;(async () => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId)
				const overIndex = tasks.findIndex((t) => t.id === overId)

				if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
					// Fix introduced after video recording
					tasks[activeIndex].columnId = tasks[overIndex].columnId

					return await updateTasks(
						arrayMove(tasks, activeIndex, overIndex - 1)
					)
				}

				return await updateTasks(
					arrayMove(tasks, activeIndex, overIndex)
				)
			})()
		}

		const isOverAColumn = over.data.current?.type === 'Column'

		// Im dropping a Task over a column
		if (isActiveATask && isOverAColumn) {
			;(async () => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId)
				tasks[activeIndex].columnId = overId as ColumnId
				await updateTasks(arrayMove(tasks, activeIndex, activeIndex))
			})()
		}
	}

	const updateTasks = async (data: Task[]) => {
		try {
			const date = new Date().getTime()

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				tasks: data,
				updatedAt: date,
			})
		} catch (e) {
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	useEffect(() => {
		if (data) {
			setTasks(data)
		}
	}, [data])

	return (
		<DndContext
			sensors={sensors}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}>
			<div className='grid grid-cols-3 gap-7'>
				<SortableContext items={columnIds}>
					{columns.map((col) => (
						<ColumnContainer
							ownerId={ownerId}
							key={col.id}
							column={col}
							ownTasks={tasks.filter(
								(task) => task.columnId === col.id
							)}
							tasks={tasks}
							members={members}
							tags={tags}
						/>
					))}
				</SortableContext>
			</div>

			{createPortal(
				<DragOverlay>
					{activeCol && (
						<ColumnContainer
							ownerId={ownerId}
							column={activeCol}
							tasks={tasks}
							ownTasks={tasks.filter(
								(task) => task.columnId === activeCol.id
							)}
							tags={tags}
							members={members}
						/>
					)}

					{activeTask && (
						<Card
							tasks={tasks}
							task={activeTask}
							members={members}
							ownerId={ownerId}
						/>
					)}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	)
}

export default memo(KanbanBoard)
