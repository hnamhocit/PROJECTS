import { FC, memo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ProjectWithTeam } from '@/types/projectWithTeam'
import { User } from '@/types/user'
import Link from 'next/link'
import Dashboard from './Dashboard'
import Drive from './Drive'
import Tasks from './Tasks'

interface TabsContainerProps {
	project: ProjectWithTeam | undefined
	members: User[]
}

const TabsContainer: FC<TabsContainerProps> = ({ project, members }) => {
	const [activeIndex, setActiveIndex] = useState(0)

	const tabs = [
		{
			title: 'Dashboard',
			children: (
				<Dashboard
					members={members}
					tags={project?.tags}
					tasks={project?.tasks}
					drive={project?.drive}
					ownerId={project?.team.ownerId}
				/>
			),
		},
		{
			title: 'Tasks',
			children: <Tasks tasks={project?.tasks} tags={project?.tags} />,
		},

		{
			title: 'Drive',
			children: (
				<Drive
					drive={project?.drive}
					ownerId={project?.team.ownerId}
					members={members}
				/>
			),
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

				<Link href={`/projects/${project?.id}/communication`}>
					<Button variant='ghost'>Communication</Button>
				</Link>
			</div>

			{tabs[activeIndex].children}
		</div>
	)
}

export default memo(TabsContainer)
