import { FC, ReactNode, memo } from 'react'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '../ui/dialog'

interface DialogContainerProps {
	header: ReactNode
	children: ReactNode
	trigger: ReactNode
}

const DialogContainer: FC<DialogContainerProps> = ({
	header,
	children,
	trigger,
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>{header}</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}

export default memo(DialogContainer)
