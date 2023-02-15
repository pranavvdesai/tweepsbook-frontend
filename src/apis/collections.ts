import type { AxiosResponse } from 'axios'

import type { Collection } from '@/types'

import { sessionAxiosInstance } from './instances'

export const readCollections = () => {
	return sessionAxiosInstance.get('/crud/read', {
		params: {
			queryType: 'collections',
		},
	}) as Promise<AxiosResponse<Collection[]>>
}
