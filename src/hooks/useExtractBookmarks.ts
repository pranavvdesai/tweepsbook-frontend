import { extractBookmarksFromPages } from '@/utils'

export const useExtractBookmarks = (
	data: InfiniteData<AxiosResponse<ReadBookmarks>> | undefined
) => {
	return data ? extractBookmarksFromPages(data) : undefined
}
