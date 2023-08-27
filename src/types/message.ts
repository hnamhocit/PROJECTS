export type Message = {
	id: string
	content: string
	seenBy: string[]
	senderId: string
	driveLinks?: string[]
	createdAt: string
	updatedAt: string
}
