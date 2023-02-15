import type { AxiosResponse } from 'axios'

import type { BasicBookmark } from '@/types'

import { staticAxiosInstance } from './instances'

export const fetchModule = (bookmarkId: string) => {
	return staticAxiosInstance.get('/fetch/module', {
		params: {
			queryType: 'bookmark',
			bookmarkId,
		},
	}) as Promise<
		AxiosResponse<{
			bookmark: BasicBookmark | null
			ownershipStatus: boolean
		}>
	>
}
