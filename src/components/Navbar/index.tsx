'use client'

import {
	Bell,
	Calendar,
	ClipboardCheck,
	FolderOpen,
	HardDrive,
	LayoutDashboard,
	Search,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { selectUser } from '@/redux/features/userSlice'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '../ui/button'
import ActiveLink from './ActiveLink'
import CreateProject from './CreateProject'
import UserMenu from './UserMenu'

const pages = [
	{
		href: '/',
		icon: <LayoutDashboard size={20} />,
		content: 'Home',
	},
	{
		href: '/projects',
		icon: <FolderOpen size={20} />,
		content: 'Projects',
	},
	{
		href: '/calendar',
		icon: <Calendar size={20} />,
		content: 'Calender',
	},
	{
		href: '/todo',
		icon: <ClipboardCheck size={20} />,
		content: 'ToDo',
	},
	{
		href: '/drive',
		icon: <HardDrive size={20} />,
		content: 'Drive',
	},
]

const Navbar = () => {
	const user = useAppSelector(selectUser)
	const [active, setActive] = useState({ width: 0, left: 0 })

	return (
		<div className='sticky inset-x-0 top-0 flex h-16 bg-white border-b'>
			<div
				className='absolute bottom-0 h-1 transition bg-blue-500 shadow-sm rounded-t-xl shadow-blue-500/50'
				style={{
					width: active.width,
					left: active.left,
				}}></div>

			<div className='flex items-center justify-center w-16 h-16 shrink-0'>
				<Link href='/'>
					<Image
						src='/images/logo.jpg'
						alt='App logo'
						width={50}
						height={50}
						className='rounded-full object-fit'
					/>
				</Link>
			</div>

			<div className='flex items-center justify-between flex-1 px-4'>
				<div className='flex items-center gap-3'>
					{pages.map((page) => (
						<ActiveLink
							key={page.href}
							{...page}
							setActive={setActive}
						/>
					))}
				</div>

				<div className='flex items-center gap-3'>
					<CreateProject />

					<Button size='icon' variant='ghost'>
						<Search size={20} />
					</Button>

					<div className='relative'>
						{(
							user?.notifications.filter(
								(notify) => !notify.seen
							) ?? []
						).length > 0 && (
							<div className='absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full shadow-md shadow-red-600/50'></div>
						)}

						<Button size='icon' variant='ghost'>
							<Bell size={20} />
						</Button>
					</div>

					<UserMenu />
				</div>
			</div>
		</div>
	)
}

export default Navbar
