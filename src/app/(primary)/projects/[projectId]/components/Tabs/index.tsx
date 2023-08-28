import { FC, memo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { File } from '@/types/file'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import Dashboard from './Dashboard'
import Drive from './Drive'

interface TabsContainerProps {
	members: User[]
	tags: string[] | undefined
	tasks: Task[] | undefined
	drive: File[] | undefined
}

const TabsContainer: FC<TabsContainerProps> = ({
	members,
	tags,
	tasks,
	drive,
}) => {
	const [activeIndex, setActiveIndex] = useState(0)

	const tabs = [
		{
			title: 'Dashboard',
			children: (
				<Dashboard
					members={members}
					tags={tags}
					tasks={tasks}
					drive={drive}
				/>
			),
		},
		{
			title: 'Tasks',
			children: <p>Tasks</p>,
		},
		{
			title: 'Communication',
			children: <p>Communication</p>,
		},
		{
			title: 'Drive',
			children: <Drive drive={drive} />,
		},
	]

	return (
		<div className='space-y-5'>
			<div className='flex items-center gap-5'>
				{tabs.map((tab, i) => (
					<Button
						key={tab.title}
						onClick={() => setActiveIndex(i)}
						variant={activeIndex === i ? 'primary' : 'ghost'}>
						{tab.title}
					</Button>
				))}
			</div>

			{tabs[activeIndex].children}
		</div>
	)
}

export default memo(TabsContainer)
