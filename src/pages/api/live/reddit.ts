import type { NextApiRequest, NextApiResponse } from 'next'
import Snoowrap from 'snoowrap'

const getPromise = async (cb: Promise<any>) =>
	new Promise((resolve, reject) => {
		cb.then((data) => resolve(data)).catch((err) => reject(err))
	})

export default async function Handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const {
			method,
			headers: { authorization },
		} = req
		switch (method) {
			case 'GET': {
				const snoowrapInstance = new Snoowrap({
					userAgent: 'Slipbox',
					accessToken: authorization as string,
				})
				const userSaves = await getPromise(
					snoowrapInstance.getMe().getSavedContent()
				)
				return res.status(200).json({
					message: 'Reddits have successfully been fetched.',
					data: userSaves,
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
