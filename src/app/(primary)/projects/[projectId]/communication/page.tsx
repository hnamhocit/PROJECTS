'use client'

import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/useProject'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Composer from './components/Composer'
import Message from './components/Message'

const Communication = ({
	params: { projectId },
}: {
	params: { projectId: string }
}) => {
	const { loading, project, members } = useProject(projectId)
	const router = useRouter()

	if (loading) return <Loading />

	return (
		<div className='relative w-full h-full'>
			<div className='sticky inset-x-0 top-0 flex items-center justify-between px-4 bg-white border-b h-14'>
				<div className='flex items-center gap-3'>
					<div
						className='w-10 h-10 bg-center bg-no-repeat bg-cover rounded-full'
						style={{
							backgroundImage: `url(${project?.team.photoURL})`,
						}}></div>

					<div>
						<div className='text-sm font-semibold'>
							{project?.name}
						</div>
						<div className='text-xs text-gray-500'>
							{members.length} members
						</div>
					</div>
				</div>

				<Button
					variant='destructive'
					size='icon'
					onClick={() => router.back()}>
					<LogOut size={20} />
				</Button>
			</div>

			<div className='p-4 space-y-3 h-[calc(100%-112px)] overflow-y-scroll'>
				{project?.messages.map((message, i) => (
					<Message
						key={message.id}
						i={i}
						message={message}
						messages={project?.messages}
						members={members}
					/>
				))}
			</div>

			<Composer messages={project?.messages} />
		</div>
	)
}

export default Communication
