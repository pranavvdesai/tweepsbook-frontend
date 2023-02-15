import { sessionAxiosInstance } from './instances'

export const createCollection = (name: string) => {
	return sessionAxiosInstance.post(
		'/crud/create',
		{
			collection: { name },
		},
		{
			params: {
				queryType: 'collection',
			},
		}
	)
}

export const updateCollection = (
	collectionId: string,
	newCollectionName: string
) => {
	return sessionAxiosInstance.patch(
		'/crud/update',
		{
			collection: {
				collectionId,
				collectionObject: {
					collection_name: newCollectionName,
				},
			},
		},
		{
			params: {
				queryType: 'collection',
			},
		}
	)
}

export const deleteCollection = (collectionId: string) => {
	return sessionAxiosInstance.delete('/crud/delete', {
		data: {
			collection: { collectionId },
		},
		params: {
			queryType: 'collection',
		},
	})
}
