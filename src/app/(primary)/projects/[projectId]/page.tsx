'use client'

import moment from 'moment'

import Loading from '@/components/Loading'
import { useProject } from '@/hooks/useProject'
import Tabs from './components/Tabs'

const ProjectDetail = ({
	params: { projectId },
}: {
	params: { projectId: string }
}) => {
	const { loading, members, project } = useProject(projectId)

	if (loading) return <Loading />

	return (
		<div className='p-4 space-y-7'>
			<div className='space-y-2'>
				<div className='text-5xl font-bold'>{project?.name}</div>

				<div className='text-gray-500'>
					{moment(project?.updatedAt).fromNow()}
				</div>
			</div>

			<Tabs project={project} members={members} />
		</div>
	)
}

export default ProjectDetail
