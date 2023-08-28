import { File } from './file'
import { Message } from './message'
import { Task } from './task'

export type Project = {
	id: string
	name: string
	messages: Message[]
	tasks: Task[]
	drive: File[]
	tags: string[]
	teamId: string
	createdAt: number
	updatedAt: number
}
