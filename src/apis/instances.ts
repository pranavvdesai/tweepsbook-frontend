import axios from 'axios'

export const sessionAxiosInstance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_PROD_API_URL
			: process.env.NEXT_PUBLIC_TEST_API_URL,
})

export const noAuthAxiosInstance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_PROD_API_URL
			: process.env.NEXT_PUBLIC_TEST_API_URL,
})

export const staticAxiosInstance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? process.env.NEXT_PUBLIC_PROD_API_URL
			: process.env.NEXT_PUBLIC_TEST_API_URL,
	headers: {
		authorization: `Bearer ${process.env.NEXT_PUBLIC_STATIC_AUTH_TOKEN}`,
	},
})
