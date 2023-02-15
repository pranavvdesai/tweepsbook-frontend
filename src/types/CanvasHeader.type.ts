import type { Bookmark } from './Bookmark.types'

export type CanvasHeaderProps = {
	details:
		| {
				hasAuthor: true
				primaryId?: string
				icon?: JSX.Element
				secondaryId?: string
				id: string
				favorite_status: boolean
				link: string
		  }
		| {
				hasAuthor: false
				title?: string
				id: string
				favorite_status: boolean
				link: string
		  }
	isAdmin: boolean
	focus: number
	bookmarkId: Bookmark['_id']
	shareStatus: Bookmark['share_status']
}
