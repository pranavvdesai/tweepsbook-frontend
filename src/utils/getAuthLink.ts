export const getAuthLink = (client: string, profileId?: string) =>
	`${
		process.env.NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_PROD_API_URL
			: process.env.NEXT_PUBLIC_TEST_API_URL
	}/auth/?queryType=${client}&authorization=${
		process.env.NEXT_PUBLIC_STATIC_AUTH_TOKEN
	}${profileId ? `&profile_id=${profileId}` : ''}`
