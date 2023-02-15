import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { TweetV1 } from 'twitter-api-v2'

import { sourceToTweepsIdMap } from '@/data'
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
			query: { bookmarkId },
		} = req
		switch (method) {
			case 'GET': {
				const {
					data: { bookmark: userBookmark },
				}: {
					data: {
						bookmark: Bookmark
					}
				} = (await axios.get(
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
							bookmarkId,
							queryType: 'bookmark',
						},
					}
				)) as AxiosResponse<{ bookmark: Bookmark }>
				if (!userBookmark) {
					return res
						.status(404)
						.json({ message: 'Invalid bookmark ID', data: null })
				}
				if (
					userBookmark.bookmark_source !== TweepsbookSources.REDDIT &&
					userBookmark.bookmark_source !==
						TweepsbookSources.PINTEREST &&
					userBookmark.bookmark_source !== TweepsbookSources.TWITTER
				) {
					return res.status(200).json({
						message: 'Bookmark successfully fetched',
						data: userBookmark,
					})
				}
				const { bookmark_source: source } = userBookmark
				const accessToken = (() => {
					if (source === TweepsbookSources.PINTEREST) {
						return pinterestaccesstoken
					}
					if (source === TweepsbookSources.REDDIT) {
						return redditaccesstoken
					}
					return ''
				})()
				const { data: bookmarkData }: { data: any[] } = await (
					await fetch(
						`${
							process.env.NEXT_PUBLIC_DEPLOYED_LINK
						}/api/live/${source}?ids=${[
							userBookmark[sourceToTweepsIdMap[source]],
						]}`,
						{
							headers: {
								authorization: accessToken as string,
							},
						}
					)
				).json()
				if (bookmarkData.length === 0) {
					return res.status(500).json({
						message: 'Could not fetch data for the bookmark.',
						data: null,
					})
				}
				if (
					authorization &&
					userBookmark.bookmark_source ===
						TweepsbookSources.TWITTER &&
					!userBookmark.post_data
				) {
					await axios.patch(
						`${
							process.env.NODE_ENV === 'production'
								? process.env.NEXT_PUBLIC_PROD_API_URL
								: process.env.NEXT_PUBLIC_TEST_API_URL
						}/crud/update`,
						{
							bookmark: {
								bookmarkId,
								bookmarkObject: {
									post_data: bookmarkData[0]?.full_text,
								},
							},
						},
						{
							headers: {
								authorization,
							},
							params: {
								queryType: 'bookmark',
							},
						}
					)
				}
				return res.status(200).json({
					message: 'Bookmark successfully fetched.',
					data: {
						...userBookmark,
						content_data: bookmarkData[0],
						post_data:
							userBookmark.bookmark_source ===
								TweepsbookSources.TWITTER &&
							!userBookmark.post_data
								? (bookmarkData[0] as TweetV1).full_text
								: userBookmark.post_data,
					},
				})
			}
			default: {
				return res.status(404).json({
					message: 'Method not supported on this endpoint.',
					data: null,
				})
			}
		}
	} catch (err) {
		return res
			.status(500)
			.json({ message: 'Something went wrong.', data: err })
	}
}
