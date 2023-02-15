export enum CollectionState {
	PUSH = 'push',
	POP = 'pop',
}

export interface Collection {
	_id: string
	collection_name: string
	profile_id: string
	createdAt: Date
	updatedAt: Date
}
