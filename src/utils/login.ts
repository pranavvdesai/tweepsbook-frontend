import { identifyUserOnPostHog } from '@/analytics'
import { readAccount, sessionAxiosInstance } from '@/apis'
import { syncBookmarks } from '@/apis/sync'
import type { LoginArgs } from '@/types'

export const login = async (sessionToken: string) => {
	try {
		const { data } = await readAccount(sessionToken)
		return data
	} catch (err) {
		return null
	}
}

const setTokenInLSAndAxiosHeader = async (sessionToken: string) => {
	localStorage.setItem('session-token', sessionToken)
	sessionAxiosInstance.defaults.headers.common.Authorization = `Bearer ${sessionToken}`
}

export const postLoginActions = async ({
	sessionToken,
	identifyOnPostHog,
	profileId,
	name,
}: LoginArgs) => {
	try {
		await setTokenInLSAndAxiosHeader(sessionToken)
		await syncBookmarks(sessionToken)
		if (identifyOnPostHog) {
			identifyUserOnPostHog(profileId, name)
		}
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err)
	}
}
