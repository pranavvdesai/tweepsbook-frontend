import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import TopBarProgress from 'react-topbar-progress-indicator'

import { authenticationFailed, authenticationSuccessful } from '@/analytics'
import { updateAccount } from '@/apis'
import { useAuth } from '@/contexts'
import { AuthActionTypes, AuthStatus } from '@/types'
import { login, postLoginActions, postLogoutActions } from '@/utils'

TopBarProgress.config({
	barColors: {
		'0': '#0A1334',
		'0.5': '#0A1334',
	},
	barThickness: 7,
	shadowBlur: 5,
})

const Callback = () => {
	const router = useRouter()
	const {
		auth: { authStatus },
		authDispatch,
	} = useAuth()
	const { sessionToken: sessionTokenFromParam } = router.query as {
		sessionToken?: string
	}

	const authenticate = async (sessionToken: string) => {
		try {
			authDispatch({
				type: AuthActionTypes.AUTHENTICATING,
				payload: {
					authStatus: AuthStatus.AUTHENTICATING,
					credentials: null,
				},
			})
			const profile = await login(sessionToken)
			if (profile) {
				authDispatch({
					type: AuthActionTypes.AUTHENTICATE,
					payload: {
						authStatus: AuthStatus.AUTHENTICATED,
						credentials: {
							profile,
							sessionToken,
						},
					},
				})
				await postLoginActions({
					sessionToken,
					identifyOnPostHog: true,
					profileId: profile.profile_id,
					name: profile.name,
				})
				authenticationSuccessful()
				router.push('/dashboard')
			} else {
				authDispatch({
					type: AuthActionTypes.UNAUTHENTICATE,
					payload: {
						authStatus: AuthStatus.UNAUTHENTICATED,
						credentials: null,
					},
				})
				postLogoutActions()
			}
		} catch (err) {
			authDispatch({
				type: AuthActionTypes.UNAUTHENTICATE,
				payload: {
					authStatus: AuthStatus.UNAUTHENTICATED,
					credentials: null,
				},
			})
			postLogoutActions()
		}
	}

	const handleUpdateAccount = async (sessionToken: string) => {
		try {
			const email = localStorage.getItem('email')
			if (email) {
				await updateAccount(sessionToken, email)
				await authenticate(sessionToken)
			} else {
				await authenticate(sessionToken)
			}
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		if (sessionTokenFromParam) {
			handleUpdateAccount(sessionTokenFromParam)
		}
	}, [sessionTokenFromParam])

	useEffect(() => {
		return () => {
			if (authStatus === AuthStatus.UNAUTHENTICATED) {
				authenticationFailed()
			}
		}
	}, [])

	return (
		<>
			<Head>
				<title>Authenticate</title>
			</Head>
			{authStatus !== AuthStatus.AUTHENTICATED ? (
				<TopBarProgress />
			) : (
				<div className='flex justify-center items-center min-h-screen'>
					<p className='font-bold text-xl'>Redirecting...</p>
				</div>
			)}
		</>
	)
}

export default Callback
