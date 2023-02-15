import type { AxiosResponse } from 'axios'
import axios from 'axios'

import type { Bookmark, CollectionState } from '@/types'

import { sessionAxiosInstance } from './instances'

export const createBookmark = (link: string) => {
	return sessionAxiosInstance.post(
		'/crud/create',
		{
			bookmark: { link },
		},
		{
			params: {
				queryType: 'bookmark',
			},
		}
	)
}

export const readBookmark = (
	bookmarkId: string,
	sessionToken: string,
	pinterestaccesstoken?: string,
	redditaccesstoken?: string
) => {
	return axios.get('/api/bookmark', {
		headers: {
			authorization: `Bearer ${sessionToken}`,
			pinterestaccesstoken,
			redditaccesstoken,
		},
		params: {
			bookmarkId,
		},
	}) as Promise<AxiosResponse<{ message: string; data: Bookmark | null }>>
}

export const readFavourites = () => {
	return sessionAxiosInstance.get('/crud/read', {
		params: {
			queryType: 'bookmarks',
			favorite_status: true,
		},
	})
}

export const updateBookmark = (
	bookmarkId: string,
	share_status?: boolean,
	archive_status?: boolean,
	canvas_data?: string[],
	canvas_schema?: string,
	favorite_status?: boolean
) => {
	return sessionAxiosInstance.patch(
		'/crud/update',
		{
			bookmark: {
				bookmarkId,
				bookmarkObject: {
					share_status,
					archive_status,
					canvas_data,
					canvas_schema,
					favorite_status,
				},
			},
		},
		{
			params: {
				queryType: 'bookmark',
			},
		}
	)
}

export const updateBookmarkCollection = (
	actionType: CollectionState,
	bookmarkId: string,
	collectionName: string
) => {
	return sessionAxiosInstance.patch(
		'/crud/update',
		{
			bookmark: {
				bookmarkId,
			},
			collection: {
				collectionName,
				collectionState: actionType,
			},
		},
		{
			params: {
				queryType: 'bookmarkCollection',
			},
		}
	)
}

export const deleteBookmark = (bookmarkId: string) => {
	return sessionAxiosInstance.delete('/crud/delete', {
		data: {
			bookmark: { bookmarkId },
		},
		params: {
			queryType: 'bookmark',
		},
	})
}
