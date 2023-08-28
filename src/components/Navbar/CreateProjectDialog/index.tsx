import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { doc, setDoc } from 'firebase/firestore'
import { CheckIcon, Plus, X } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

import Dialog from '@/components/Dialog'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { useTeams } from '@/hooks/useTeams'
import { cn } from '@/lib/utils'

const formSchema = z.object({
	name: z.string().min(4).max(30),
	tags: z.array(z.string().nonempty().max(60)).nonempty().max(10),
	teamId: z.string(),
})

const CreateProjectDialog = () => {
	const [tag, setTag] = useState('')
	const [disabled, setDisabled] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const { teams } = useTeams()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tags: [],
		},
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.startsWith(' ')) return
		setTag(e.target.value)
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDisabled(true)

			const id = uuidv4()
			const date = new Date().getTime()

			await setDoc(doc(db, 'projects', id), {
				id,
				...values,
				tasks: [],
				messages: [],
				drive: [],
				createdAt: date,
				updatedAt: date,
			})

			setDisabled(false)
			form.reset({ name: '', teamId: '', tags: [] })
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<Dialog
			trigger={<Button variant='primary'>Create a new project</Button>}
			header={<DialogTitle>Create a new project</DialogTitle>}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-5'>
					<FormField
						control={form.control}
						name='name'
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
						name='tags'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Tags ({field.value?.length})
								</FormLabel>

								<FormControl>
									<div className='flex flex-wrap items-center gap-3'>
										{field.value?.map((tag) => (
											<div
												className='flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 rounded-md'
												key={tag}>
												<span>{tag}</span>

												<button
													type='button'
													onClick={() =>
														field.onChange(
															field.value?.filter(
																(t) => t !== tag
															)
														)
													}>
													<X size={16} />
												</button>
											</div>
										))}

										<div className='flex items-center gap-2 px-3 py-2 border rounded-md'>
											<input
												ref={inputRef}
												type='text'
												placeholder='Tag...'
												value={tag}
												onChange={handleChange}
												className='text-sm outline-none max-w-[120px]'
											/>

											<button
												onClick={() => {
													if (tag.length === 0) return

													field.onChange([
														...field.value,
														tag,
													])

													setTag('')
												}}
												type='button'>
												<Plus size={16} />
											</button>
										</div>
									</div>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='teamId'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Select team</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant='outline'
												role='combobox'
												className={cn(
													'w-[200px] justify-between',
													!field.value &&
														'text-muted-foreground'
												)}>
												{field.value
													? teams.find(
															(team) =>
																team.id ===
																field.value
													  )?.name
													: 'Select team'}
												<CaretSortIcon className='w-4 h-4 ml-2 opacity-50 shrink-0' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='w-[200px] p-0'>
										<Command>
											<CommandInput
												placeholder='Search team...'
												className='h-9'
											/>
											<CommandEmpty>
												No teams found (create or join
												to continue)
											</CommandEmpty>
											<CommandGroup>
												{teams.map((team) => (
													<CommandItem
														value={team.id}
														key={team.id}
														onSelect={() => {
															form.setValue(
																'teamId',
																team.id
															)
														}}>
														{team.name}
														<CheckIcon
															className={cn(
																'ml-auto h-4 w-4',
																team.id ===
																	field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button variant='primary' disabled={disabled} type='submit'>
						Continue
					</Button>
				</form>
			</Form>
		</Dialog>
	)
}

export default CreateProjectDialog
