import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'

const TYPESENSE_SERVER_CONFIG = {
	apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY, // Be sure to use an API key that only allows searches, in production
	nodes: [
		{
			host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
			port: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
			protocol: process.env.REACT_APP_TYPESENSE_PROTOCOL,
		},
	],
	connectionTimeoutSeconds: 1,
	numRetries: 8,
}

export const typesenseAdapter = new TypesenseInstantsearchAdapter({
	server: TYPESENSE_SERVER_CONFIG,
	additionalSearchParameters: {
		queryBy: 'content,author,keyword',
		queryByWeights: '4,2,1',
		numTypos: 3,
		typoTokensThreshold: 1,
	},
})

export const { searchClient } = typesenseAdapter
