import { FC, memo } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import Dashboard from './Dashboard'

interface TabsContainerProps {
	members: User[]
	tags: string[] | undefined
	tasks: Task[] | undefined
}

const TabsContainer: FC<TabsContainerProps> = ({ members, tags, tasks }) => {
	const tabs = [
		{
			value: 'dashboard',
			children: <Dashboard members={members} tags={tags} tasks={tasks} />,
		},
		{
			value: 'tasks',
			children: <Dashboard members={members} tags={tags} tasks={tasks} />,
		},
		{
			value: 'communication',
			children: <Dashboard members={members} tags={tags} tasks={tasks} />,
		},
		{
			value: 'drive',
			children: <Dashboard members={members} tags={tags} tasks={tasks} />,
		},
	]

	return (
		<Tabs defaultValue={tabs[0].value}>
			<TabsList className='inline-flex items-center gap-5 mb-5'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className='capitalize'>
						{tab.value}
					</TabsTrigger>
				))}
			</TabsList>

			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.children}
				</TabsContent>
			))}
		</Tabs>
	)
}

export default memo(TabsContainer)
