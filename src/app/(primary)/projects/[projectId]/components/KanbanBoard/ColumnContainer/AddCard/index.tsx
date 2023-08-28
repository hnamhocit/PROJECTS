import { zodResolver } from '@hookform/resolvers/zod'
import { doc, updateDoc } from 'firebase/firestore'
import { Check, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

import Avatar from '@/components/Avatar'
import Dialog from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { ColumnId } from '@/types/Column'
import { Task } from '@/types/task'
import { User } from '@/types/user'
import Subtask from '../Subtask'

interface AddCardProps {
	columnId: ColumnId
	tags: string[] | undefined
	tasks: Task[]
	members: User[]
}

const formSchema = z.object({
	title: z.string().nonempty().max(100),
	description: z.string().nonempty().max(600),
	tag: z.string().nonempty(),
	assignedFor: z.array(z.string().nonempty()).nonempty(),
	subtasks: z.array(
		z.object({
			id: z.string().uuid(),
			content: z.string().nonempty().max(600),
			isComplete: z.boolean(),
			createdAt: z.number(),
			updatedAt: z.number(),
		})
	),
})

const AddCard: FC<AddCardProps> = ({ columnId, tasks, tags, members }) => {
	const path = usePathname()
	const [search, setSearch] = useState('')
	const [content, setContent] = useState('')
	const [disabled, setDisabled] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			assignedFor: [],
			subtasks: [],
		},
	})
	const { toast } = useToast()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDisabled(true)

			const id = uuidv4()
			const date = new Date().getTime()

			const newData = {
				id,
				title: values.title,
				description: values.description,
				tag: values.tag,
				assignedFor: values.assignedFor,
				columnId,
				subtasks: values.subtasks,
				createdAt: date,
				updatedAt: date,
			}

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				tasks: [...(tasks ?? []), newData],
				updatedAt: date,
			})

			setSearch('')
			setDisabled(false)
			form.reset({
				title: '',
				description: '',
				tag: '',
				assignedFor: [],
				subtasks: [],
			})
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<Dialog
			trigger={
				<Button variant='secondary' className='w-full'>
					<Plus size={20} className='mr-2' />
					<span>Add card</span>
				</Button>
			}
			header={<DialogTitle>ADD NEW CARD</DialogTitle>}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-5'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>

								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>

								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='tag'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tag</FormLabel>

								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select a tag to display' />
										</SelectTrigger>
									</FormControl>

									<SelectContent>
										{tags?.map((tag) => (
											<SelectItem key={tag} value={tag}>
												{tag}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='assignedFor'
						render={() => (
							<FormItem>
								<FormLabel>Assigned for</FormLabel>

								<div className='space-y-3'>
									<Input
										placeholder='Search member...'
										value={search}
										onChange={(e) => {
											const val = e.target.value
											if (val.startsWith(' ')) return
											setSearch(val)
										}}
									/>

									<div className='flex flex-wrap items-center gap-2'>
										{members
											.filter((member) =>
												member.displayName.includes(
													search
												)
											)
											.map((member) => (
												<FormField
													key={member.uid}
													control={form.control}
													name='assignedFor'
													render={({ field }) => {
														return (
															<FormControl>
																<button
																	type='button'
																	className='relative'
																	onClick={() => {
																		field.onChange(
																			field.value?.includes(
																				member.uid
																			)
																				? field.value?.filter(
																						(
																							uid
																						) =>
																							member.uid !==
																							uid
																				  )
																				: [
																						...field.value,
																						member.uid,
																				  ]
																		)
																	}}>
																	<Avatar
																		src={
																			member.photoURL
																		}
																		alt={
																			member.displayName
																		}
																	/>

																	{field.value?.includes(
																		member.uid
																	) && (
																		<div className='absolute inset-0 flex items-center justify-center text-white bg-[rgba(31,37,50,0.5)] rounded-full'>
																			<Check
																				size={
																					20
																				}
																			/>
																		</div>
																	)}
																</button>
															</FormControl>
														)
													}}
												/>
											))}
									</div>
								</div>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='subtasks'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Subtasks (optional)</FormLabel>

								<FormControl>
									<div className='space-y-2'>
										{field.value?.map((subtask) => (
											<Subtask
												key={subtask.id}
												subtask={subtask}
												onChange={() => {
													field.onChange(
														field.value?.map(
															(d) => {
																if (
																	d.id ===
																	subtask.id
																) {
																	return {
																		...subtask,
																		isComplete:
																			!subtask.isComplete,
																	}
																}

																return d
															}
														)
													)
												}}
												onDelete={() => {
													field.onChange(
														field.value?.filter(
															(sub) =>
																sub.id !==
																subtask.id
														)
													)
												}}
											/>
										))}

										<div className='flex items-center gap-3'>
											<Input
												placeholder='Enter task...'
												value={content}
												onChange={(e) => {
													if (
														e.target.value.startsWith(
															' '
														)
													)
														return

													setContent(e.target.value)
												}}
											/>

											<Button
												type='button'
												variant='secondary'
												size='icon'
												onClick={() => {
													if (content.length === 0)
														return

													const date =
														new Date().getTime()

													field.onChange([
														...field.value,
														{
															id: uuidv4(),
															content,
															isComplete: false,
															createdAt: date,
															updatedAt: date,
														},
													])

													setContent('')
												}}>
												<Plus size={20} />
											</Button>
										</div>
									</div>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className='w-full'
						disabled={disabled}
						variant='primary'
						type='submit'>
						Continue
					</Button>
				</form>
			</Form>
		</Dialog>
	)
}

export default memo(AddCard)
