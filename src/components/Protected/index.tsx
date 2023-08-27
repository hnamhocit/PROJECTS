'use client'

import { User, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { ReactNode, useCallback, useEffect, useState } from 'react'

import { auth, db } from '@/config/firebase'
import { selectUser, setUser } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Auth from '../Auth'
import Loading from '../Loading'
import { useToast } from '../ui/use-toast'

const Protected = ({ children }: { children: ReactNode }) => {
	const user = useAppSelector(selectUser)
	const dispatch = useAppDispatch()
	const { toast } = useToast()
	const [loading, setLoading] = useState(true)

	const handleStateChanged = useCallback(
		async (data: User | null) => {
			try {
				if (!data) {
					setLoading(false)
					return
				}

				const docRef = doc(db, 'users', data.uid)
				const updatedData = { updatedAt: new Date().getTime() }
				const snapshot = await getDoc(docRef)

				dispatch(setUser({ ...snapshot.data(), ...updatedData }))
				setLoading(false)
			} catch (e) {
				setLoading(false)
				toast({
					variant: 'destructive',
					description: (e as Error).message,
				})
			}
		},
		[dispatch, toast]
	)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, handleStateChanged)
		return () => unsubscribe()
	}, [handleStateChanged])

	if (loading) return <Loading />

	if (!user) return <Auth />

	return children
}

export default Protected
