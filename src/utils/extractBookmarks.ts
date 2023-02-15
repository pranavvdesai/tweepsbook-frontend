export const extractBookmarksFromPages = (
	data: InfiniteData<AxiosResponse<ReadBookmarks>>
) => {
	const bookmarks: Bookmark[] = []
	data.pages.forEach((page) => {
		page.data.data.bookmarks.forEach((bookmark) => {
			bookmarks.push(bookmark)
		})
	})
	return bookmarks
}
