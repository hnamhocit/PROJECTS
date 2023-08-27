import { ColumnId } from './Column'

export type Subtask = {
	id: string
	content: string
	isComplete: boolean
	createdAt: number
	updatedAt: number
}

export type Task = {
	id: string
	title: string
	description: string
	columnId: ColumnId
	tag: string
	subtasks: Subtask[]
	assignedFor: string[]
	createdAt: number
	updatedAt: number
}
