import { zodResolver } from '@hookform/resolvers/zod'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
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
import { Task } from '@/types/task'
import AddSubtask from '../KanbanBoard/ColumnContainer/AddSubtask'
import Subtask from '../Subtask'

interface EditCardProps {
	task: Task
	onClose?: () => void
	tasks: Task[] | undefined
	tags: string[] | undefined
}

const formSchema = z.object({
	title: z.string().nonempty().max(100),
	description: z.string().nonempty().max(600),
	tag: z.string().nonempty(),
	subtasks: z.array(
		z.object({
			id: z.string().uuid(),
			content: z.string().nonempty(),
			isComplete: z.boolean().default(false),
			createdAt: z.number(),
			updatedAt: z.number(),
		})
	),
})

const EditCard: FC<EditCardProps> = ({ task, tasks, onClose, tags }) => {
	const [disabled, setDisabled] = useState(false)

	const path = usePathname()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: task.title,
			description: task.description,
			tag: task.tag,
			subtasks: task.subtasks,
		},
	})
	const { toast } = useToast()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDisabled(true)

			const date = new Date().getTime()
			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				tasks: tasks?.map((t) => {
					if (t.id === task.id) {
						return {
							...t,
							...values,
							updatedAt: date,
						}
					}

					return t
				}),
				updatedAt: date,
			})

			if (onClose) onClose()
			setDisabled(false)
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<Form {...form}>
			<form onClick={form.handleSubmit(onSubmit)} className='space-y-5'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
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
													field.value?.map((d) => {
														if (
															d.id === subtask.id
														) {
															return {
																...subtask,
																isComplete:
																	!subtask.isComplete,
															}
														}

														return d
													})
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

									<AddSubtask
										onChange={(content) => {
											const date = new Date().getTime()

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
										}}
									/>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex items-center gap-3'>
					<Button
						variant='outline'
						className='flex-1'
						type='button'
						onClick={onClose}>
						Back
					</Button>

					<Button
						disabled={disabled}
						variant='primary'
						className='flex-1'
						type='submit'>
						Continue
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default memo(EditCard)
