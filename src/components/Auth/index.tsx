import { zodResolver } from '@hookform/resolvers/zod'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

import { auth, db } from '@/config/firebase'
import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'

const formSchema = z.object({
	name: z.string().min(4).max(30).optional(),
	email: z.string().email(),
	password: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!'
		),
})

const Auth = () => {
	const [disabled, setDisabled] = useState(false)
	const [isLogin, setIsLogin] = useState(true)

	const { toast } = useToast()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setDisabled(true)

			// if login else sign up and break this code
			if (isLogin) {
				await signInWithEmailAndPassword(
					auth,
					values.email,
					values.password
				)

				toast({ description: 'Logged in successfully 🎉🎉🎉' })
				setDisabled(false)
				form.reset()

				return
			}

			// validate before sign up
			if (!values.name || values.name?.length === 0) {
				toast({
					variant: 'destructive',
					description: 'Please enter your name!',
				})
				setDisabled(false)
				return
			}

			const { user } = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			)

			const date = new Date().getTime()

			await setDoc(doc(db, 'users', user.uid), {
				uid: user.uid,
				displayName: values.name,
				email: values.email,
				emailVerified: user.emailVerified,
				phoneNumber: user.phoneNumber,
				photoURL: user.photoURL,
				address: null,
				bio: null,
				role: 'USER',
				notifications: [
					{
						id: uuidv4(),
						title: 'PROJECTS SYSTEM NOTIFICATION 🤖',
						description:
							'Start managing your projects faster, more convenient and better. The application is developed and built by hnamhocit (Hoang Nam), hope you like it and share it with all your friends ❤️❤️❤️.',
						seen: false,
						senderId: 'qt8N81bvNpQfU36LD4J1darqwij2',
						createdAt: date,
						updatedAt: date,
					},
				],
				socials: {
					website: null,
					twitter: null,
					facebook: null,
					github: null,
				},
				createdAt: date,
				updatedAt: date,
			})

			form.reset()
			setDisabled(false)
			toast({
				title: `Welcome to PROJECTS, ${values.name} 👋`,
				description: 'Account was created successfully 🎉🎉🎉',
			})
		} catch (e) {
			setDisabled(false)
			toast({ variant: 'destructive', description: (e as Error).message })
		}
	}

	const toggleIsLogin = () => setIsLogin(!isLogin)

	return (
		<div
			className='flex items-center justify-center h-screen bg-center bg-no-repeat bg-cover'
			style={{
				backgroundImage: 'url("/images/background.jpg")',
			}}>
			<div className='w-full max-w-sm p-8 bg-white rounded-xl'>
				<div>
					<div className='text-2xl font-bold'>
						WELCOME TO PROJECTS
					</div>

					<div className='text-sm text-gray-500'>
						Start managing your projects faster, more convenient and
						better.
					</div>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-5 my-5'>
						{!isLogin && (
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>

										<FormControl>
											<Input
												placeholder='Ex: Shadcn'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>

									<FormControl>
										<Input
											type='email'
											placeholder='Ex: nguyenvana@gmail.com'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>

									<FormControl>
										<Input
											type='password'
											placeholder='Ex: nguyenvana123'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							variant='primary'
							disabled={disabled}
							type='submit'>
							Continue
						</Button>
					</form>
				</Form>

				<div className='text-sm text-center text-gray-700'>
					{isLogin ? "Dont' have an account? " : 'New to PROJECTS? '}

					<button
						className='font-medium text-blue-600 underline'
						onClick={toggleIsLogin}>
						{isLogin ? 'SIGN UP' : 'LOGIN'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Auth
