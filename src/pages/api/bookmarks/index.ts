import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { sourceToTweepsIdMap, tweepsToSourceIdMap } from '@/data'
import type { Bookmark } from '@/types'
import { TweepsbookSources } from '@/types'

export default async function Handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const {
			headers: { authorization, redditaccesstoken, pinterestaccesstoken },
			method,
			query: { next, limit, collectionId },
		} = req
		switch (method) {
			case 'GET': {
				const {
					data: { bookmarks: userBookmarks, cursor },
				}: {
					data: {
						message: string
						bookmarks: Bookmark[]
						cursor: string | number
					}
				} = await axios.get(
					`${
						process.env.NODE_ENV === 'production'
							? process.env.NEXT_PUBLIC_PROD_API_URL
							: process.env.NEXT_PUBLIC_TEST_API_URL
					}/crud/read`,
					{
						headers: {
							authorization,
						},
						params: {
							collectionId,
							next,
							limit: limit || 10,
							queryType: 'bookmarks',
						},
					}
				)

				const ids: {
					[TweepsbookSources.TWITTER]?: string[]
					[TweepsbookSources.PINTEREST]?: string[]
					[TweepsbookSources.REDDIT]?: string[]
				} = {}
				userBookmarks.forEach((bookmark: Bookmark) => {
					const { bookmark_source: source } = bookmark
					if (
						source === TweepsbookSources.TWITTER ||
						source === TweepsbookSources.PINTEREST ||
						source === TweepsbookSources.REDDIT
					) {
						const id = bookmark[sourceToTweepsIdMap[source]]
						if (id) {
							if (ids[source]) {
								ids[source]?.push(id)
							} else {
								ids[source] = [id]
							}
						}
					}
				})
				const availableSources = Object.keys(ids) as TweepsbookSources[]
				const bookmarksData: {
					[TweepsbookSources.TWITTER]?: any[]
					[TweepsbookSources.PINTEREST]?: any[]
					[TweepsbookSources.REDDIT]?: any[]
				} = {}
				await Promise.all(
					availableSources.map(async (source) => {
						const accessToken = (() => {
							if (source === TweepsbookSources.PINTEREST) {
								return pinterestaccesstoken
							}
							if (source === TweepsbookSources.REDDIT) {
								return redditaccesstoken
							}
							return ''
						})()
						const { data }: { data: any[] } = await (
							await fetch(
								`${process.env.NEXT_PUBLIC_DEPLOYED_LINK}/api/live/${source}?ids=${ids[source]}`,
								{
									headers: {
										authorization: accessToken as string,
									},
								}
							)
						).json()
						if (bookmarksData[source]) {
							bookmarksData[source]?.push(...data)
						} else {
							bookmarksData[source] = data
						}
						return null
					})
				)
				const populatedBookmarks: any[] = []
				userBookmarks.forEach((bookmark) => {
					const source = bookmark.bookmark_source
					if (
						source !== TweepsbookSources.TWITTER &&
						source !== TweepsbookSources.PINTEREST &&
						source !== TweepsbookSources.REDDIT
					) {
						populatedBookmarks.push(bookmark)
					} else {
						const contentData = bookmarksData[source]?.find(
							(bookmarkData) =>
								bookmark[sourceToTweepsIdMap[source]] ===
								bookmarkData[tweepsToSourceIdMap[source]]
						)
						if (contentData) {
							populatedBookmarks.push({
								...bookmark,
								content_data: contentData,
							})
						}
					}
				})
				res.status(200).json({
					message: 'Bookmarks successfully fetched.',
					data: {
						bookmarks: populatedBookmarks,
						userBookmarks,
						paginationData: { cursor },
					},
				})

        break
			}
			default: {
				res.status(404).json({
					message: 'Method not supported on this endpoint.',
					data: null,
				})
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong.', data: err })
	}
}
