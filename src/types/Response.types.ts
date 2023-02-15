import type { Bookmark } from './Bookmark.types'

export type ReadBookmarks = {
	message: string
	data: {
		bookmarks: Bookmark[]
		paginationData: {
			cursor: string | -1
		}
	}
}
