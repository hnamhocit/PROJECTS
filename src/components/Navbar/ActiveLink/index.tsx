import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Dispatch,
	FC,
	ReactElement,
	SetStateAction,
	memo,
	useEffect,
	useRef,
} from 'react'

interface ActiveLinkProps {
	href: string
	content: string
	icon: ReactElement
	setActive: Dispatch<
		SetStateAction<{
			width: number
			left: number
		}>
	>
}

function isActiveLink(href: string, path: string) {
	if (href === path) return true
	if (href !== '/' && path.startsWith(href)) return true
	return false
}

const ActiveLink: FC<ActiveLinkProps> = ({
	href,
	content,
	icon,
	setActive,
}) => {
	const path = usePathname()
	const eleRef = useRef<HTMLAnchorElement>(null)
	const isActive = isActiveLink(href, path)

	useEffect(() => {
		if (isActive) {
			if (eleRef.current) {
				const rect = eleRef.current.getBoundingClientRect()
				setActive({ width: rect?.width, left: rect?.left })
			}
		}
	}, [setActive, isActive])

	return (
		<Link
			ref={eleRef}
			href={href}
			className={clsx(
				'flex items-center gap-2 text-gray-500 px-3 text-sm hover:text-blue-500 transition',
				{
					'!text-blue-500 font-medium': isActive,
				}
			)}>
			{icon}
			<span>{content}</span>
		</Link>
	)
}

export default memo(ActiveLink)
