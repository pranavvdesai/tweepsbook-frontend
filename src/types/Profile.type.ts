interface AuthTokens {
	accessToken: string
	refreshToken: string
}

export interface Profile {
	_id: string
	createdAt: string
	updatedAt: string
	profile_id: string
	profile_image: string
	workspace_username: string
	email: string
	name: string
	twitter_username: string
	reddit_username: string
	pinterest_username: string
	pinterest_auth_tokens?: AuthTokens
	reddit_auth_tokens?: AuthTokens
	twitter_auth_tokens?: AuthTokens
	google_auth_tokens?: AuthTokens
}

// will extend later
