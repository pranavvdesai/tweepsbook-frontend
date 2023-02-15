import { posthog } from 'posthog-js'

import { userDeleted } from '@/analytics'
import { sessionAxiosInstance } from '@/apis'

const removeTokenFromLSAndAxiosHeader = () => {
	localStorage.removeItem('session-token')
	sessionAxiosInstance.defaults.headers.common.Authorization = undefined
}

export const postLogoutActions = (resetPostHog?: boolean) => {
	removeTokenFromLSAndAxiosHeader()
	if (resetPostHog && posthog) {
		userDeleted()
		posthog.reset()
	}
}
