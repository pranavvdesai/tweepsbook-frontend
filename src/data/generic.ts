import { TweepsbookSources } from '@/types'

export const sourceToTweepsIdMap = {
	[TweepsbookSources.TWITTER]: 'twitter_status_id',
	[TweepsbookSources.REDDIT]: 'reddit_post_id',
	[TweepsbookSources.PINTEREST]: 'pinterest_post_id',
}

export const tweepsToSourceIdMap = {
	[TweepsbookSources.TWITTER]: 'id_str',
	[TweepsbookSources.REDDIT]: 'id',
	[TweepsbookSources.PINTEREST]: 'id',
}
