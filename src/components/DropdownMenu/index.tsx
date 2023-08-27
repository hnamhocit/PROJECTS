import { FC, ReactNode, memo } from 'react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface DropdownMenuContainerProps {
	trigger: ReactNode
	children: ReactNode
}

const DropdownMenuContainer: FC<DropdownMenuContainerProps> = ({
	children,
	trigger,
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
			<DropdownMenuContent>{children}</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default memo(DropdownMenuContainer)
