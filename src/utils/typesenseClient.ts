import { Client } from 'typesense'

const TYPESENSE_SERVER_CONFIG = {
	apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY as string,
	nodes: [
		{
			host: process.env.NEXT_PUBLIC_TYPESENSE_HOST as string,
			port: process.env.NEXT_PUBLIC_TYPESENSE_PORT as unknown as number,
			protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL as string,
		},
	],
	connectionTimeoutSeconds: 1,
	numRetries: 8,
}

export const typesenseClient = new Client(TYPESENSE_SERVER_CONFIG)
