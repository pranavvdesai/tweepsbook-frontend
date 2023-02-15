/* eslint-disable react/display-name */
import Router from 'next/router'
import React, { useEffect } from 'react'
import TopBarProgress from 'react-topbar-progress-indicator'

import { useAuth } from '@/contexts'
import { AuthStatus } from '@/types'

TopBarProgress.config({
	barColors: {
		'0': '#0A1334',
		'0.5': '#0A1334',
	},
	barThickness: 7,
	shadowBlur: 5,
})

export const withAuth =
	<P extends object>(
		Component: React.ComponentType<P>,
		isPrivate?: boolean,
		blockAuthenticationUI?: boolean,
		redirectTo?: string,
		UnauthenticatedComponent?: JSX.Element
	) =>
	(props: any) => {
		const {
			auth: { authStatus },
		} = useAuth()

		const authCriteria =
			isPrivate === undefined || isPrivate === true
				? authStatus !== AuthStatus.UNAUTHENTICATED
				: authStatus !== AuthStatus.AUTHENTICATED

		useEffect(() => {
			if (!authCriteria && redirectTo) {
				Router.push(redirectTo)
			}
		}, [authCriteria, redirectTo])

		if (
			blockAuthenticationUI &&
			(authStatus === AuthStatus.AUTHENTICATING ||
				authStatus === AuthStatus.NOT_INITIATED)
		) {
			return <TopBarProgress />
		}

		if (authCriteria) {
			return <Component {...props} />
		}
		return UnauthenticatedComponent || null
	}
