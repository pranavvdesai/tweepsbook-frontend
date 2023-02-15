import type { MutableRefObject } from 'react'

import type { Bookmark } from './Bookmark.types'
import type { TweepsbookSources } from './Generic.type'

interface BasicCard {
	archiveStatus: Bookmark['archive_status']
	bookmarkId: Bookmark['_id']
	date: Bookmark['createdAt']
	lastCardRef: MutableRefObject<HTMLDivElement | null> | null
	source: Bookmark['bookmark_source']
	text?: string
	time: Bookmark['createdAt']
	tags: Bookmark['collections']
}

interface PinterestCard extends BasicCard {
	imageSrc: string
	primaryId: undefined
	secondaryId: undefined
	source: TweepsbookSources.PINTEREST
	userAvatarSrc?: string
}

interface RedditCard extends BasicCard {
	imageSrc?: string
	primaryId: string
	secondaryId: string
	source: TweepsbookSources.REDDIT
	text: string
	userAvatarSrc?: string
}

interface TwitterCard extends BasicCard {
	imageSrc?: string
	primaryId?: string
	secondaryId: string
	source: TweepsbookSources.TWITTER
	text: string
	userAvatarSrc?: string
}

interface CustomBookmarkCard extends BasicCard {
	imageSrc?: string
	primaryId?: string
	secondaryId?: string
	source: TweepsbookSources.CUSTOM
	userAvatarSrc?: string
}

export type CardProps =
	| PinterestCard
	| RedditCard
	| TwitterCard
	| CustomBookmarkCard
