import Image from 'next/image'
import { FC, memo } from 'react'

interface AvatarProps {
	src: string | undefined | null
	replaceURL?: string
	size?: number
	alt?: string
}

const Avatar: FC<AvatarProps> = ({
	src,
	alt = '',
	replaceURL = '/images/default-avatar.jpg',
	size = 40,
}) => {
	return (
		<Image
			src={src ?? replaceURL}
			alt={alt}
			width={size}
			height={size}
			className='border-2 w-10 h-10 object-cover border-[#1f2532] rounded-full'
		/>
	)
}

export default memo(Avatar)
