'use client'

import { useTeams } from '@/hooks/useTeams'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

const Sidebar = () => {
	const { loading, teams } = useTeams()

	return (
		<div className='flex flex-col items-center w-16 gap-5 py-5 overflow-scroll border-r shrink-0'>
			{loading ? (
				<>
					<Skeleton className='w-10 h-10 rounded-full' />
					<Skeleton className='w-10 h-10 rounded-full' />
					<Skeleton className='w-10 h-10 rounded-full' />
					<Skeleton className='w-10 h-10 rounded-full' />
					<Skeleton className='w-10 h-10 rounded-full' />
				</>
			) : (
				<>
					{teams.map((team) => (
						<div
							key={team.id}
							className='w-10 h-10 bg-center bg-no-repeat bg-cover rounded-full'
							style={{
								backgroundImage: `url(${team.photoURL})`,
							}}></div>
					))}

					<Button variant='secondary' size='icon'>
						<Plus size={20} />
					</Button>
				</>
			)}
		</div>
	)
}

export default Sidebar
