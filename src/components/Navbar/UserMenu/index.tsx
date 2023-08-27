import { LogOut, Plus, Settings, User2, UserPlus2, Users2 } from 'lucide-react'

import Avatar from '@/components/Avatar'
import DropdownMenu from '@/components/DropdownMenu'
import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { auth } from '@/config/firebase'
import { selectUser, setUser } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signOut } from 'firebase/auth'

const UserMenu = () => {
	const user = useAppSelector(selectUser)
	const dispatch = useAppDispatch()
	const { toast } = useToast()

	const handleLogout = async () => {
		await signOut(auth)
		dispatch(setUser(null))
		toast({ description: 'User logout successfully!' })
	}

	return (
		<DropdownMenu trigger={<Avatar src={user?.photoURL} />}>
			<DropdownMenuLabel>My Account</DropdownMenuLabel>
			<DropdownMenuSeparator />

			<DropdownMenuItem>
				<User2 size={20} className='mr-2' />
				<span>Profile</span>
			</DropdownMenuItem>

			<DropdownMenuItem>
				<Settings size={20} className='mr-2' />
				<samp>Settings</samp>
			</DropdownMenuItem>
			<DropdownMenuSeparator />

			<DropdownMenuItem>
				<Users2 size={20} className='mr-2' />
				<span>Team</span>
			</DropdownMenuItem>

			<DropdownMenuItem>
				<UserPlus2 size={20} className='mr-2' />
				<span>Invite users</span>
			</DropdownMenuItem>

			<DropdownMenuItem>
				<Plus size={20} className='mr-2' />
				<span>New team</span>
			</DropdownMenuItem>
			<DropdownMenuSeparator />

			<DropdownMenuItem onClick={handleLogout}>
				<LogOut size={20} className='mr-2' />
				<span>Log out</span>
			</DropdownMenuItem>
		</DropdownMenu>
	)
}

export default UserMenu
