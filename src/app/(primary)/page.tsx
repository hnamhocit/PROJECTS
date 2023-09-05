'use client'

import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import Project from '@/components/Project'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Project as IProject } from '@/types/project'
import { ProjectWithTeam } from '@/types/projectWithTeam'
import { Team } from '@/types/team'

export default function Home() {
	const [projects, setProjects] = useState<ProjectWithTeam[]>([])
	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState(1)
	const user = useAppSelector(selectUser)
	const { toast } = useToast()

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const projects = (
					await getDocs(collection(db, 'projects'))
				).docs.map((doc) => doc.data()) as IProject[]

				const validProjects: ProjectWithTeam[] = []

				for (let i = 0; i < projects.length; i++) {
					const project = projects[i]

					const team = (
						await getDoc(doc(db, 'teams', project.teamId))
					).data() as Team

					if (team.memberIds.includes(user?.uid as string)) {
						validProjects.push({ ...project, team })
					}
				}

				setProjects(validProjects)
				setLoading(false)
			} catch (e) {
				setLoading(false)
				toast({
					variant: 'destructive',
					description: (e as Error).message,
				})
			}
		}

		fetchProjects()
	}, [toast, user?.uid])

	if (loading) return <Loading />

	return (
		<div className='p-4 space-y-5'>
			<div className='space-y-3'>
				<div className='flex items-center justify-between'>
					<div className='text-xl font-bold'>Your project</div>
					<div className='flex items-center gap-3'>
						<button
							disabled={page === 1}
							onClick={() => setPage(page - 1)}>
							<ChevronLeft size={20} />
						</button>

						<span className='text-gray-500'>
							{page} / {Math.ceil(projects.length / 4)}
						</span>

						<button
							disabled={page === Math.ceil(projects.length / 4)}
							onClick={() => setPage(page + 1)}>
							<ChevronRight size={20} />
						</button>
					</div>
				</div>

				<div className='grid grid-cols-4 gap-5'>
					{projects.slice((page - 1) * 4, page * 4).map((project) => (
						<Project key={project.id} {...project} />
					))}
				</div>
			</div>

			<div className='space-y-3'>
				<div className='text-xl font-bold'>To Do</div>

				<div className='grid grid-cols-4 gap-5'></div>
			</div>
		</div>
	)
}
