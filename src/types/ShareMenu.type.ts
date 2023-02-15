import type { Bookmark } from './Bookmark.types'

export type ShareMenuProps = {
	isAdmin: boolean
	bookmarkId: Bookmark['_id']
	shareStatus: Bookmark['share_status']
	closeMenu: () => void
}
