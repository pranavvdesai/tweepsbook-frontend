import type { TweetV1 } from 'twitter-api-v2'

import type { Collection } from './Collection.type'
import type { TweepsbookSources } from './Generic.type'

export interface BasicBookmark {
	_id: string
	archive_status: boolean
	article_link: string
	bookmark_source: TweepsbookSources
	canvas_data: string[]
	canvas_schema: string
	collections: Collection[]
	createdAt: string
	post_data: string
	post_heading: string
	profile_id: string
	share_status: boolean
	updatedAt: string
	favorite_status: boolean
}

interface PinterestBookmarkContent {
	alt_text: null | string
	media: {
		media_type: 'image'
		images: {
			originals: {
				url: string
			}
		}
	}
	id: string
	description: string
}

interface RedditBookmarkContent {
	author_fullname: string
	author: string
	title?: string
	link_flair_richtext: [
		{
			e: string
			t: string
		}
	]
	body?: string
	subreddit_name_prefixed: string
	link_flair_css_class: string
	name: string
	link_flair_text_color: string
	upvote_ratio: 0.94
	author_flair_background_color: null
	author_flair_template_id: null
	is_original_content: boolean
	is_reddit_media_domain: boolean
	author_premium: boolean
	thumbnail: string
	edited: boolean
	post_hint: string
	subreddit_type: string
	created: 1668101578
	preview?: {
		images?: { source: { url: string } }[]
		enabled: boolean
	}
	permalink: string
	url: string
	created_utc: number
	media: null
	is_video: boolean
}

export interface TwitterBookmark extends BasicBookmark {
	bookmark_source: TweepsbookSources.TWITTER
	content_data: TweetV1
	twitter_status_id: string
}

export interface RedditBookmark extends BasicBookmark {
	bookmark_source: TweepsbookSources.REDDIT
	content_data: RedditBookmarkContent
	reddit_post_id: string
}

export interface PinterestBookmark extends BasicBookmark {
	bookmark_source: TweepsbookSources.PINTEREST
	content_data: PinterestBookmarkContent
	pinterest_post_id: string
}

export interface CustomBookmark extends BasicBookmark {
	bookmark_source: TweepsbookSources.CUSTOM
	content_data?: undefined
}

export type Bookmark =
	| TwitterBookmark
	| RedditBookmark
	| PinterestBookmark
	| CustomBookmark
