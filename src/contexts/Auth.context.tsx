import { createContext, useContext, useEffect, useReducer } from 'react'

import { authReducer } from '@/reducers'
import type { AuthContext as IAuthContext } from '@/types'
import { AuthActionTypes, AuthStatus } from '@/types'
import { login, postLoginActions } from '@/utils'

import { SyncContext } from './Sync.context'

const AuthContext = createContext({} as IAuthContext)

const sessionTokenVarNameInLS = 'session-token'

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const { setHasExpired } = useContext(SyncContext)
	const [auth, authDispatch] = useReducer(authReducer, {
		authStatus: AuthStatus.NOT_INITIATED,
		credentials: null,
	})
	useEffect(() => {
		;(async () => {
			const sessionToken = localStorage.getItem(sessionTokenVarNameInLS)
			if (sessionToken) {
				const profile = await login(sessionToken)
				if (profile) {
					authDispatch({
						type: AuthActionTypes.AUTHENTICATE,
						payload: {
							credentials: { profile, sessionToken },
							authStatus: AuthStatus.AUTHENTICATED,
						},
					})
					;(async () => {
						try {
							await postLoginActions({
								sessionToken,
								identifyOnPostHog: true,
								profileId: profile.profile_id,
								name: profile.name,
							})
						} catch (error) {
							setHasExpired(true)
						}
					})()
				}
			} else {
				authDispatch({
					type: AuthActionTypes.UNAUTHENTICATE,
					payload: {
						credentials: null,
						authStatus: AuthStatus.UNAUTHENTICATED,
					},
				})
			}
		})()
	}, [])

	return (
		<AuthContext.Provider value={{ auth, authDispatch }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
