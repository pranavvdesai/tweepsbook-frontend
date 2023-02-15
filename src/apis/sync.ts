import { noAuthAxiosInstance } from './instances'

export const syncBookmarks = (sessionToken: string) => {
	return noAuthAxiosInstance.get('/utils/sync', {
		headers: {
			Authorization: `Bearer ${sessionToken}`,
		},
		params: {
			queryType: 'bookmarks',
		},
	})
}
