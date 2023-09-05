import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { Project } from '@/types/project'
import { ProjectWithTeam } from '@/types/projectWithTeam'
import { Team } from '@/types/team'
import { User } from '@/types/user'

export const useProject = (projectId: string) => {
	const [loading, setLoading] = useState(true)
	const [project, setProject] = useState<ProjectWithTeam>()
	const [members, setMembers] = useState<User[]>([])

	const router = useRouter()
	const { toast } = useToast()

	const handleError = useCallback(
		(type: string) => {
			setLoading(false)
			router.push('/')
			toast({
				variant: 'destructive',
				description: `${type} doesn't exist or has been deleted!`,
			})
		},
		[router, toast]
	)

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(db, 'projects', projectId),
			async (snapshot) => {
				if (!snapshot.exists()) {
					handleError('Project')
					return
				}

				const project = snapshot.data() as Project
				const teamSnap = await getDoc(doc(db, 'teams', project.teamId))

				if (!teamSnap.exists()) {
					handleError('Team')
					return
				}

				const team = teamSnap.data() as Team

				const q = query(
					collection(db, 'users'),
					where('uid', 'in', team.memberIds)
				)
				const membersSnap = await getDocs(q)

				const members = membersSnap.docs.map((doc) =>
					doc.data()
				) as User[]

				setLoading(false)
				setProject({ ...project, team })
				setMembers(members)
			},
			(error) => {
				setLoading(false)
				toast({ variant: 'destructive', description: error.message })
			}
		)

		return () => unsubscribe()
	}, [projectId, router, toast, handleError])

	return { loading, project, members }
}
