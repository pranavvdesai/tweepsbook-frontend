import type { AxiosResponse } from 'axios'
import axios from 'axios'

import type { ReadBookmarks } from '@/types'

export const readBookmarks = (
	sessionToken: string,
	next?: string,
	collectionId?: string,
	limit?: number,
	pinterestaccesstoken?: string,
	redditaccesstoken?: string
) => {
	return axios.get('/api/bookmarks', {
		headers: {
			authorization: `Bearer ${sessionToken}`,
			pinterestaccesstoken,
			redditaccesstoken,
		},
		params: {
			next,
			collectionId,
			limit,
		},
	}) as Promise<AxiosResponse<ReadBookmarks>>
}
