/* eslint-disable no-underscore-dangle */
import type { TDDocument, TDShape, TDToolType, TldrawApp } from '@tldraw/tldraw'
import Markdown from 'markdown-to-jsx'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PinterestLogo } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import TopBarProgress from 'react-topbar-progress-indicator'

import { fetchModule, readBookmark, updateBookmark } from '@/apis'
import { CanvasHeader as Header, twitterSvg } from '@/components'
import { withPostHogAnalytics } from '@/components/hoc'
import { RedditIcon } from '@/components/Icons'
import { useAuth } from '@/contexts'
import { useThrottle } from '@/hooks'
import type {
	BasicBookmark,
	Bookmark,
	CanvasHeaderProps,
	RedditBookmark,
	TwitterBookmark,
} from '@/types'
import { AuthStatus, TweepsbookSources } from '@/types'

// eslint-disable-next-line import/extensions
import Toolbar from '../../../../components/canvas_toolbar/CanvasToolbar.jsx'

TopBarProgress.config({
	barColors: {
		'0': '#0A1334',
		'0.5': '#0A1334',
	},
	barThickness: 7,
	shadowBlur: 5,
})

const instanceOfPopulatedBookmark = (value: Bookmark | BasicBookmark) => {
	return 'content_data' in value
}

const instanceOfLiveBookmark = (value: any) => 'message' in value

const getDetails: (
	bookmark: Bookmark | BasicBookmark
) => CanvasHeaderProps['details'] = (bookmark: Bookmark | BasicBookmark) => {
	const source = bookmark.bookmark_source
	const isPopulated = instanceOfPopulatedBookmark(bookmark)
	if (source === TweepsbookSources.TWITTER && isPopulated) {
		return {
			hasAuthor: true,
			icon: twitterSvg,
			primaryId: (bookmark as TwitterBookmark).content_data.user.name,
			secondaryId: (bookmark as TwitterBookmark).content_data.user
				.screen_name,
			id: bookmark._id,
			favorite_status: bookmark.favorite_status,
			link: `https://twitter.com/x/status/${
				(bookmark as TwitterBookmark).twitter_status_id
			}`,
		}
	}
	if (source === TweepsbookSources.PINTEREST) {
		return {
			hasAuthor: true,
			icon: <PinterestLogo />,
			id: bookmark._id,
			favorite_status: bookmark.favorite_status,
		}
	}
	if (source === TweepsbookSources.REDDIT && isPopulated) {
		return {
			hasAuthor: true,
			icon: <RedditIcon width='24px' height='24px' />,
			primaryId: (bookmark as RedditBookmark).content_data.author,
			secondaryId: (bookmark as RedditBookmark).content_data
				.subreddit_name_prefixed,
			id: bookmark._id,
			favorite_status: bookmark.favorite_status,
			link: `https://www.reddit.com/comments/${
				(bookmark as RedditBookmark).reddit_post_id
			}`,
		}
	}
	return {
		hasAuthor: false,
		title: bookmark.post_heading,
		id: bookmark._id,
		favorite_status: bookmark.favorite_status,
		link: bookmark.article_link,
	}
}

const Tldraw = dynamic(
	() => import('@tldraw/tldraw').then((lib) => lib.Tldraw),
	{ ssr: false }
)

const updatationInterval = 2000

const extractTextFromCanvas = (document: TDDocument) => {
	const allShapes: TDShape[] | null = document.pages.page?.shapes
		? Object.values(document.pages.page.shapes)
		: null
	if (allShapes) {
		return allShapes.reduce((acc, shape) => {
			if (shape.type === 'sticky' || shape.type === 'text') {
				acc.push(shape.text)
			}
			return acc
		}, [] as string[])
	}
	return null
}

const extractBookmarkIdFromParam = (param: string, seperator: string) => {
	const allSeperatedStrings = param.split(seperator)
	return allSeperatedStrings[allSeperatedStrings.length - 1]
}

const Canvas = () => {
	const {
		auth: { authStatus, credentials },
	} = useAuth()
	const router = useRouter()
	const {
		query: { username, bookmark: bookmarkParam },
	} = router
	const tlDrawRef = useRef<TldrawApp | null>(null)
	const [zoom, setZoom] = useState<number>(100)
	const [activeTool, setActiveTool] = useState<TDToolType | null>(null)
	const [tlDrawDoc, setTlDrawDoc] = useState<TDDocument | undefined>(
		undefined
	)
	const [bookmark, setBookmark] = useState<Bookmark | BasicBookmark | null>(
		null
	)
	const updateCanvasData: (app: TldrawApp, bookmarkId: string) => void =
		useThrottle((app: TldrawApp, bookmarkId: string) => {
			console.log('hi')

			if (app.document.id === bookmarkId) {
				updateBookmark(
					bookmarkId,
					undefined,
					undefined,
					extractTextFromCanvas(app.document) || undefined,
					JSON.stringify(app.document),
					undefined
				)
			}
		}, updatationInterval)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)

	useEffect(() => {
		if (localStorage.getItem('theme')) {
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
		}
	}, [])

	useEffect(() => {
		;(async () => {
			try {
				setIsError(false)
				setIsLoading(true)
				if (
					!bookmarkParam ||
					!username ||
					Array.isArray(bookmarkParam) ||
					authStatus === AuthStatus.AUTHENTICATING ||
					authStatus === AuthStatus.NOT_INITIATED
				)
					return
				const bookmarkId = extractBookmarkIdFromParam(
					bookmarkParam,
					'-'
				)
				if (!bookmarkId) return
				const { data } =
					username === credentials?.profile.workspace_username
						? await readBookmark(
								bookmarkId,
								credentials.sessionToken,
								credentials.profile.pinterest_auth_tokens
									?.accessToken,
								credentials.profile.reddit_auth_tokens
									?.accessToken
						  )
						: await fetchModule(bookmarkId)
				const bookmarkData = instanceOfLiveBookmark(data)
					? (data as { data: Bookmark | null }).data
					: (data as { bookmark: BasicBookmark | null }).bookmark
				if (!bookmarkData) return
				const titleToPushInUrl = bookmarkData.post_heading
					.replaceAll(' ', '-')
					.replaceAll('?', '')
					.replaceAll('/', '')
				router.push(
					'/[username]/document/[bookmark]',
					`/${username}/document/${titleToPushInUrl}-${bookmarkId}`,
					{
						shallow: true,
					}
				)
				const initiateWith = bookmarkData.canvas_schema
					? ((await JSON.parse(
							bookmarkData.canvas_schema
					  )) as TDDocument)
					: undefined
				setBookmark(bookmarkData)
				if (initiateWith) {
					initiateWith.name = bookmarkData.post_heading
					// eslint-disable-next-line no-underscore-dangle
					initiateWith.id = bookmarkData._id
				}
				setTlDrawDoc(initiateWith)
			} catch (err) {
				setIsError(true)
			} finally {
				setIsLoading(false)
			}
		})()
	}, [bookmarkParam, username, credentials?.sessionToken, authStatus])

	const tlDrawMountHandler = (app: TldrawApp) => {
		const tlDrawContainer: HTMLDivElement | null =
			document.querySelector('.tl-container')
		if (tlDrawContainer) {
			tlDrawContainer.style.backgroundColor = '#0000'
		}
		tlDrawRef.current = app
	}

	const tlDrawChangeHandler = (app: TldrawApp) => {
		setZoom(Math.floor(app.zoom * 100))
		setActiveTool(app.currentTool.type)
		if (
			bookmark &&
			authStatus === AuthStatus.AUTHENTICATED &&
			credentials?.profile.workspace_username === username
		) {
			updateCanvasData(app, bookmark._id)
		}
	}

	if (isError) {
		return (
			<div className='all-center'>
				<p className='font-semibold'>
					Something went wrong. Please reload the page.
				</p>
			</div>
		)
	}

	if (isLoading) {
		return <TopBarProgress />
	}

	return (
		<>
			<Head>
				<title>{bookmark ? bookmark.post_heading : 'Canvas'}</title>
			</Head>
			{bookmark && (
				<div className='md:w-auto w-[100vh]'>
					<Header
						isAdmin={
							!!(
								credentials &&
								credentials.profile.workspace_username ===
									username
							)
						}
						details={getDetails(bookmark)}
						focus={zoom}
						bookmarkId={bookmark._id}
						shareStatus={bookmark.share_status}
					/>
					<div className='fixed bg-white dark:bg-[#111834] rounded top-[15vh] right-[2vw] z-[2]'>
						<Toolbar
							activeTool={activeTool}
							tlDrawApp={tlDrawRef.current}
						/>
					</div>
					<main className='dark:bg-grid-patterndark min-h-[100vh] bg-[#FBFBFB] dark:bg-[#0A0F21] bg-grid-size bg-grid-pattern relative pl-[2rem] pr-[5rem] md:pl-[5rem] md:pr-[15rem] py-6'>
						<div className='markdown font-[400] text-[24px] pb-4 text-[#1D1D1D] dark:text-textdark'>
							<Markdown>{bookmark.post_data}</Markdown>
						</div>
						<div className='z-[1] absolute inset-0'>
							{typeof window !== 'undefined' && (
								<Tldraw
									autofocus={false}
									document={tlDrawDoc}
									onChange={tlDrawChangeHandler}
									onMount={tlDrawMountHandler}
									showUI={false}
								/>
							)}
						</div>
					</main>
				</div>
			)}
		</>
	)
}

const AnalyticsEnabledCanvas = withPostHogAnalytics(Canvas)

export default AnalyticsEnabledCanvas

/*
tweepsbook will be fetched from the server here and then its details will be passed to the header as props
*/
