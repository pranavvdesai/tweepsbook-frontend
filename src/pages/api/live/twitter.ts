import type { NextApiRequest, NextApiResponse } from 'next'
import { TwitterApi } from 'twitter-api-v2'

export default async function Handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const {
			method,
			query: { ids },
		} = req
		switch (method) {
			case 'GET': {
				const twitterClient = new TwitterApi(
					process.env.TWITTER_TOKEN as string
				).readOnly
				const data = await twitterClient.v1.tweets(
					ids as string[] | string
				)
				return res.status(200).json({
					message: 'Tweets have successfully been fetched.',
					data,
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
