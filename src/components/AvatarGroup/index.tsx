import { FC, memo } from 'react'

import { User } from '@/types/user'
import styled from 'styled-components'
import Avatar from '../Avatar'

interface AvatarGroupProps {
	data: User[]
}

const Stack = styled.div`
	display: flex;

	&:hover div {
		margin-left: 0px;
	}
`

const StackItem = styled.div<{ $len: number; $i: number }>`
	transition: margin 0.1s linear;
	overflow: hidden;
	margin-left: ${(props) => (props.$i === 0 ? '0px' : '-10px')};
	z-index: ${(props) =>
		props.$i === 0 ? props.$len : props.$len - props.$i};
`

const AvatarGroup: FC<AvatarGroupProps> = ({ data }) => {
	const len = data.length

	return (
		<div className='flex items-center gap-3'>
			<Stack>
				{data.map((item, i) => (
					<StackItem key={item.uid} $len={len} $i={i}>
						<Avatar src={item.photoURL} />
					</StackItem>
				))}
			</Stack>

			{len > 4 && (
				<span className='text-sm text-gray-500'>and {len - 4}+</span>
			)}
		</div>
	)
}

export default memo(AvatarGroup)
