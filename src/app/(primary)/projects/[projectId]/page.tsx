'use client'

import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { Project } from '@/types/project'
import { ProjectWithTeam } from '@/types/projectWithTeam'
import { Team } from '@/types/team'
import { User } from '@/types/user'
import Tabs from './components/Tabs'

const ProjectDetail = ({ params }: { params: { projectId: string } }) => {
	const [loading, setLoading] = useState(true)
	const [project, setProject] = useState<ProjectWithTeam | null>(null)
	const [members, setMembers] = useState<User[]>([])

	const router = useRouter()
	const { toast } = useToast()

	const handleErr = useCallback(
		(type: string) => {
			setLoading(false)
			toast({
				variant: 'destructive',
				description: `${type} doesn't exist or has been deleted!`,
			})
			router.push('/')
		},
		[router, toast]
	)

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(db, 'projects', params.projectId),
			async (snapshot) => {
				if (!snapshot.exists()) {
					handleErr('Project')
					return
				}

				const project = snapshot.data() as Project
				const teamSnap = await getDoc(doc(db, 'teams', project.teamId))

				if (!teamSnap.exists()) {
					handleErr('Team')
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
			(e) => {
				setLoading(false)
				toast({ variant: 'destructive', description: e.message })
			}
		)

		return () => unsubscribe()
	}, [params.projectId, router, toast, handleErr])

	if (loading) return <Loading />

	return (
		<div className='space-y-7'>
			<div className='space-y-2'>
				<div className='text-5xl font-bold'>{project?.name}</div>

				<div className='text-gray-500'>
					{moment(project?.updatedAt).fromNow()}
				</div>
			</div>

			<Tabs
				members={members}
				tasks={project?.tasks}
				tags={project?.tags}
			/>
		</div>
	)
}

export default ProjectDetail
