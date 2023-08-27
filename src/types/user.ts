import { Notification } from './notification'

export type User = {
	uid: string
	displayName: string
	email: string
	emailVerified: boolean
	photoURL: string | null
	phoneNumber: string | null
	address: string | null
	bio: string | null
	role: 'USER' | 'ADMIN'
	notifications: Notification[]
	socials: {
		website: string | null
		twitter: string | null
		github: string | null
		facebook: string | null
	}
	createdAt: string
	updatedAt: string
}
