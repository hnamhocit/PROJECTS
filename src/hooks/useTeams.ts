import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Team } from '@/types/team'

export const useTeams = () => {
	const [teams, setTeams] = useState<Team[]>([])
	const [loading, setLoading] = useState(true)

	const { toast } = useToast()
	const user = useAppSelector(selectUser)

	useEffect(() => {
		const q = query(
			collection(db, 'teams'),
			where('memberIds', 'array-contains', user?.uid)
		)

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const data = snapshot.docs.map((doc) => doc.data()) as Team[]

				setTeams(data)
				setLoading(false)
			},
			(error) => {
				setLoading(false)
				toast({ variant: 'destructive', description: error.message })
			}
		)

		return () => {
			unsubscribe()
		}
	}, [user?.uid, toast])

	return { teams, setTeams, loading, setLoading }
}
