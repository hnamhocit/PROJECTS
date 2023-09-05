export type Message = {
	id: string
	content: string
	seenBy: string[]
	senderId: string
	recall: boolean
	createdAt: string
	updatedAt: string
}
