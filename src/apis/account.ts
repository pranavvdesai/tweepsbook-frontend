import type { AxiosResponse } from 'axios'
import axios from 'axios'

import type { Profile } from '@/types'

import {
	noAuthAxiosInstance,
	sessionAxiosInstance,
	staticAxiosInstance,
} from './instances'

export const readAccount = (sessionToken: string) => {
	return noAuthAxiosInstance.get('/crud/read', {
		headers: {
			authorization: `Bearer ${sessionToken}`,
		},
		params: {
			queryType: 'account',
		},
	}) as Promise<AxiosResponse<Profile>>
}

export const updateAccount = (
	sessionToken: string,
	newEmail?: string,
	newName?: string,
	newUsername?: string
) => {
	const userObject: {
		email?: string
		name?: string
		workspace_username?: string
	} = {}
	if (newEmail) userObject.email = newEmail
	if (newName) userObject.name = newName
	if (newUsername) userObject.workspace_username = newUsername
	return noAuthAxiosInstance.patch(
		'/crud/update',
		{
			user: {
				userObject,
			},
		},
		{
			headers: {
				authorization: `Bearer ${sessionToken}`,
			},
			params: {
				queryType: 'account',
			},
		}
	)
}

export const sendOtpToUpdateEmail = (email: string) => {
	return staticAxiosInstance.post(
		'/utils/email',
		{
			user: { email },
		},
		{
			params: {
				queryType: 'emailUpdate',
			},
		}
	)
}

export const sendOtpToDeleteAccount = (email: string) => {
	return staticAxiosInstance.post(
		'/utils/email',
		{
			user: { email },
		},
		{
			params: {
				queryType: 'accountDelete',
			},
		}
	)
}

export const verifyOtp = (code: string, email: string) => {
	return staticAxiosInstance.post(
		'/utils/check',
		{
			user: {
				code,
				key: email,
			},
		},
		{
			params: {
				queryType: 'otp',
			},
		}
	)
}

export const deleteAccount = () => {
	return sessionAxiosInstance.delete('/crud/delete', {
		params: {
			queryType: 'account',
		},
	})
}
