import { createSlice } from '@reduxjs/toolkit'

import { User } from '@/types/user'
import { RootState } from '../store'

const initialState: { data: User | null } = { data: null }

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.data = action.payload
		},
		updateUser(state, action) {
			state.data = {
				...(state.data || {}),
				...action.payload,
			}
		},
	},
})

export const { setUser, updateUser } = userSlice.actions
export const selectUser = (state: RootState) => state.user.data

export default userSlice.reducer
