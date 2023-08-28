import { Filter, LayoutGrid, LayoutList, Paperclip } from 'lucide-react'
import { FC, memo, useState } from 'react'

import AvatarGroup from '@/components/AvatarGroup'
import { Button } from '@/components/ui/button'
import { File } from '@/types/file'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import KanbanBoard from '../../KanbanBoard'

interface DashboardProps {
	members: User[]
	tags: string[] | undefined
	tasks: Task[] | undefined
	drive: File[] | undefined
}

const Dashboard: FC<DashboardProps> = ({ members, tags, tasks, drive }) => {
	const [isGrid, setIsGrid] = useState(false)
	const toggleIsGrid = () => setIsGrid(!isGrid)

	return (
		<>
			<div className='space-y-2'>
				<div className='text-gray-500'>Contributors</div>

				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-5'>
						<AvatarGroup data={members} />

						<div className='w-1 h-10 bg-gray-200 rounded-xl'></div>

						<Button variant='outline'>
							<Paperclip size={20} className='mr-2' />
							<span>{drive?.length} Files</span>
						</Button>
					</div>

					<div className='flex items-center gap-5'>
						<Button variant='outline'>
							<Filter size={20} className='mr-2' />
							<span>Filter</span>
						</Button>

						<div className='w-1 h-10 bg-gray-200 rounded-xl'></div>

						<div className='flex gap-1 p-1 border rounded-xl'>
							<Button
								variant={isGrid ? 'primary' : 'ghost'}
								size='icon'
								onClick={toggleIsGrid}>
								<LayoutGrid size={20} />
							</Button>

							<Button
								variant={isGrid ? 'ghost' : 'primary'}
								size='icon'
								onClick={toggleIsGrid}>
								<LayoutList size={20} />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<KanbanBoard tags={tags} data={tasks} members={members} />
		</>
	)
}

export default memo(Dashboard)
