import clsx from 'clsx'
import { ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import { FC, memo, useEffect, useMemo, useState } from 'react'

import { Project } from '@/types/project'
import { Team } from '@/types/team'
import getColorFromImage from '@/utils/getColorFromImage'
import rgbToHsl from '@/utils/rgbToHsl'

type ProjectWithTeam = Project & { team: Team }

const Project: FC<ProjectWithTeam> = ({ id, name, tasks, tags, team }) => {
	const [hsl, setHsl] = useState([0, 0, 1])

	const { total, percent, done } = useMemo(() => {
		const total = tasks.length
		const done = tasks.filter((task) => task.columnId === 'done').length

		return { total, percent: (done / total) * 100 || 0, done }
	}, [tasks])

	useEffect(() => {
		getColorFromImage(team.photoURL)
			.then((rgb) => setHsl(rgbToHsl(rgb[0], rgb[1], rgb[2])))
			.catch((error) => console.log(error.message))
	}, [team.photoURL])

	return (
		<Link
			href={`/projects/${id}`}
			className='flex flex-col p-4 transition border rounded-md shadow-md hover:-translate-y-2 hover:shadow-lg'
			style={{
				backgroundColor: `hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, ${
					hsl[2] * 100
				}%)`,
				color: hsl[2] > 0.5 ? '#000' : '#fff',
			}}>
			<div className='mb-5 space-y-3'>
				<div
					className='w-10 h-10 bg-white bg-center bg-no-repeat bg-contain rounded-full'
					style={{
						backgroundImage: `url(${team.photoURL})`,
					}}></div>

				<div className='text-2xl font-bold'>{name}</div>
			</div>

			<div className='mt-auto space-y-3'>
				<div className='flex flex-wrap gap-1'>
					{tags.map((tag) => (
						<button
							key={tag}
							className={clsx('block p-2 text-xs rounded-md', {
								'bg-gray-800': hsl[2] < 0.5,
								'bg-gray-100': hsl[2] > 0.5,
							})}>
							{tag}
						</button>
					))}
				</div>

				<div className='flex items-center justify-between gap-3'>
					<div className='flex items-center gap-2'>
						<ClipboardCheck size={20} />

						<span
							className={clsx('text-sm', {
								'text-gray-700': hsl[2] > 0.5,
								'text-white': hsl[2] < 0.5,
							})}>
							{done}/{total}
						</span>
					</div>

					<div className='relative flex-1 h-1 bg-gray-100 rounded-xl'>
						<div
							className='absolute top-0 left-0 h-full bg-blue-500 rounded-xl'
							style={{
								width: `${percent}%`,
							}}></div>
					</div>

					<div
						className={clsx('text-sm', {
							'text-gray-700': hsl[2] > 0.5,
							'text-white': hsl[2] < 0.5,
						})}>
						{percent.toFixed(0)}%
					</div>
				</div>
			</div>
		</Link>
	)
}

export default memo(Project)
