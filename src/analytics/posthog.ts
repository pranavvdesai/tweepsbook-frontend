import type { PostHogConfig } from 'posthog-js'
import { posthog } from 'posthog-js'

export const initPostHog = (postHogConfig: Partial<PostHogConfig> = {}) => {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY as string, {
		...postHogConfig,
	})
}

export const pageEntered = (pageTitle: string) => {
	posthog.capture('Page - Entered', { pageTitle })
}

export const pageLeft = (
	duration: number,
	pageTitle: string,
	atViewport: number
) => {
	posthog.capture('Page - Left', { duration, pageTitle, atViewport })
}

export const identifyUserOnPostHog = (profileId: string, name?: string) => {
	posthog.identify(profileId, { name })
}

export const querySearched = (query: string) => {
	posthog.capture('Query - Searched', { query })
}

export const queryFound = (query: string) => {
	posthog.capture('Query - Found', { query })
}

export const authenticationStarted = (client: string) => {
	posthog.capture('Authentication - Started', { client })
}

export const authenticationFailed = () => {
	posthog.capture('Authentication - Failed')
}

export const authenticationSuccessful = () => {
	posthog.capture('Authentication - Successfull')
}

export const buttonClicked = (role: string) => {
	posthog.capture('Clicked - Button', { role })
}

export const linkClicked = (role: string) => {
	posthog.capture('Clicked - Link', { role })
}

export const collectionAdded = (name: string) => {
	posthog.capture('Collection - Added', { name })
}

export const collectionDeleted = (name: string) => {
	posthog.capture('Collection - Deleted', { name })
}

export const bookmarkAddedToCollection = (collectionName: string) => {
	posthog.capture('Bookmark - Added to Collection', { collectionName })
}

export const bookmarkRemovedFromCollection = (collectionName: string) => {
	posthog.capture('Bookmark - Removed from Collection', { collectionName })
}

export const bookmarksSorted = (sortedBy: string) => {
	posthog.capture('Bookmarks - Sorted', { sortedBy })
}

export const bookmarksFiltered = (filteredBy: string) => {
	posthog.capture('Bookmarks - Sorted', { filteredBy })
}

export const bookmarksFetched = (totalCount: number) => {
	posthog.capture('Bookmarks - Fetched', { totalCount })
}

export const userDeleted = () => {
	posthog.capture('User - Deleted')
}

export const userLoggedOut = () => {
	posthog.capture('User - Logged Out')
}
