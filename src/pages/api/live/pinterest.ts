import type { NextApiRequest, NextApiResponse } from 'next'

export default async function Handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const {
			method,
			headers: { authorization },
			query: { ids },
		} = req
		switch (method) {
			case 'GET': {
				const pinterests: any[] = []
				await Promise.all(
					(ids as string).split(',').map(async (id) => {
						const result = await (
							await fetch(
								`https://api.pinterest.com/v5/pins/${id}`,
								{
									headers: {
										authorization: `Bearer ${authorization}`,
									},
								}
							)
						).json()
						pinterests.push(result)
					})
				)
				return res.status(200).json({
					message: 'Pinterests have successfully been fetched.',
					data: pinterests,
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
