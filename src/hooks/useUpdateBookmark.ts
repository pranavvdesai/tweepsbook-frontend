import { useMutation, useQueryClient } from 'react-query'

import { updateBookmark } from '@/apis'

export const useUpdateBookmark = (
	bookmarkId: string,
	share_status?: boolean,
	archive_status?: boolean,
	canvas_data?: string[],
	canvas_schema?: string,
	favorite_status?: boolean
) => {
	const queryClient = useQueryClient()
	const { mutate } = useMutation({
		mutationFn: () =>
			updateBookmark(
				bookmarkId,
				share_status,
				archive_status,
				canvas_data,
				canvas_schema,
				favorite_status
			),
		onSuccess: () =>
			queryClient.invalidateQueries(['canvas-doc', bookmarkId]),
	})
	return mutate
}
