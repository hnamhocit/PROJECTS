import { Message } from './message'
import { Task } from './task'

export type Project = {
	id: string
	name: string
	messages: Message[]
	tasks: Task[]
	tags: string[]
	teamId: string
	createdAt: number
	updatedAt: number
}
