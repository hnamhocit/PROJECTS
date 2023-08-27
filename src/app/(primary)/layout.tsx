import { ReactNode } from 'react'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const MainLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Navbar />

			<div className='flex h-[calc(100vh-64px)]'>
				<Sidebar />
				<main className='flex-1 p-4 overflow-y-scroll'>{children}</main>
			</div>
		</div>
	)
}

export default MainLayout
