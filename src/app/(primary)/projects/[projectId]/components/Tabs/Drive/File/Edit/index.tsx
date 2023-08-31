import { zodResolver } from '@hookform/resolvers/zod'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { FC, memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { db } from '@/config/firebase'
import { File } from '@/types/file'

const formSchema = z.object({
	hidden: z.boolean(),
	download: z.boolean(),
})

interface EditProps {
	drive: File[] | undefined
	file: File
	onClose: () => void
}

const Edit: FC<EditProps> = ({
	file: { id, download, hidden, ...rest },
	onClose,
	drive,
}) => {
	const [disabled, setDisabled] = useState(false)
	const { toast } = useToast()
	const path = usePathname()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			download,
			hidden,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDisabled(true)

			const date = new Date().getTime()

			await updateDoc(doc(db, 'projects', path.split('/')[2]), {
				drive: drive?.map((file) => {
					if (file.id === id) {
						return {
							id: file.id,
							hidden: values.hidden,
							download: values.download,
							...rest,
							updatedAt: date,
						}
					}

					return file
				}),
				updatedAt: date,
			})

			onClose()
			setDisabled(false)
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
				<FormField
					control={form.control}
					name='download'
					render={({ field }) => (
						<FormItem className='flex items-center justify-between p-4 border rounded-lg'>
							<div className='space-y-0.5'>
								<FormLabel className='text-base'>
									Download
								</FormLabel>
								<FormDescription>
									Everyone can see the file link and download
									it.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='hidden'
					render={({ field }) => (
						<FormItem className='flex flex-row items-center justify-between p-4 border rounded-lg'>
							<div className='space-y-0.5'>
								<FormLabel className='text-base'>
									Hidden
								</FormLabel>
								<FormDescription>
									Allow others to see or not.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<div className='flex gap-3'>
					<Button
						variant='outline'
						type='button'
						className='flex-1'
						onClick={onClose}>
						Back
					</Button>

					<Button
						type='submit'
						disabled={disabled}
						variant='primary'
						className='flex-1'>
						Continue
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default memo(Edit)
