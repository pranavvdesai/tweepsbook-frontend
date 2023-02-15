/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { Box, Skeleton, Spinner } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { MutableRefObject } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

import { readBookmarks } from '@/apis'
import { MasonryLayout } from '@/components'
import Card from '@/components/Card/Card'
import ConnectAccount from '@/components/ConnectAccount/ConnectAccount'
import ConnectAccount2 from '@/components/ConnectAccount2/ConnectAccount2'
import { withAuth, withPostHogAnalytics } from '@/components/hoc'
import { TwitterIcon } from '@/components/Icons/TwitterIcon'
import NoBookmark from '@/components/NoBookmark/NoBookmark'
import Sidebar from '@/components/Sidebar/Sidebar'
import { SyncContext, useAuth } from '@/contexts'
import {
	useExtractBookmarks,
	useIntersectionObserver,
	useMediaQuery,
} from '@/hooks'
import type { Bookmark } from '@/types'
import { TweepsbookSources } from '@/types'
import { getAuthLink, randomNumber } from '@/utils'

import { FilterContext } from '../contexts/filter.context'

const getCard = (
	{
		_id,
		archive_status,
		bookmark_source,
		collections,
		content_data,
		createdAt,
		post_heading,
	}: Bookmark,
	isLast: boolean,
	ref: MutableRefObject<HTMLDivElement | null>
) => {
	if (bookmark_source === TweepsbookSources.TWITTER) {
		return (
			<Card
				archiveStatus={archive_status}
				bookmarkId={_id}
				key={_id}
				text={content_data.full_text || ''}
				time={createdAt}
				date={createdAt}
				tags={collections}
				primaryId={content_data.user.name}
				secondaryId={content_data.user.screen_name}
				source={bookmark_source}
				lastCardRef={isLast ? ref : null}
				userAvatarSrc={content_data.user.profile_image_url_https}
			/>
		)
	}
	if (bookmark_source === TweepsbookSources.PINTEREST) {
		return (
			<Card
				archiveStatus={archive_status}
				bookmarkId={_id}
				key={_id}
				text={content_data.description}
				time={createdAt}
				date={createdAt}
				tags={collections}
				primaryId={undefined}
				secondaryId={undefined}
				imageSrc={content_data?.media?.images?.originals?.url}
				source={bookmark_source}
				lastCardRef={isLast ? ref : null}
			/>
		)
	}
	if (bookmark_source === TweepsbookSources.REDDIT) {
		return (
			<Card
				archiveStatus={archive_status}
				bookmarkId={_id}
				date={createdAt}
				key={_id}
				lastCardRef={isLast ? ref : null}
				primaryId={content_data.author}
				secondaryId={content_data.subreddit_name_prefixed}
				imageSrc={
					content_data?.preview?.images
						? content_data?.preview?.images[0]?.source.url
						: undefined
				}
				source={bookmark_source}
				tags={collections}
				text={(() => {
					if (content_data.title) {
						return content_data.title
					}
					if (content_data.body) {
						return content_data.body
					}
					return ''
				})()}
				time={createdAt}
			/>
		)
	}
	return (
		<Card
			archiveStatus={archive_status}
			bookmarkId={_id}
			date={createdAt}
			key={_id}
			lastCardRef={isLast ? ref : null}
			primaryId={undefined}
			secondaryId={undefined}
			source={bookmark_source}
			tags={collections}
			text={post_heading}
			time={createdAt}
		/>
	)
}

const getColumns = (dataArray: any[], numOfColumns: number) => {
	const superArray: any[] = []
	for (let arrayCount = 0; arrayCount < numOfColumns; ) {
		superArray.push([])
		arrayCount += 1
	}
	let pushIn = 0
	dataArray.forEach((el) => {
		superArray[pushIn].push(el)
		if (pushIn === numOfColumns - 1) {
			pushIn = 0
		} else {
			pushIn += 1
		}
	})
	return superArray
}

const Dashboard = () => {
	const {
		auth: { credentials },
	} = useAuth()
	const {
		query: { archive, collection },
	} = useRouter()
	const router = useRouter()
	const { hasExpired } = useContext(SyncContext)
	const {
		data: bookmarksQueries,
		isError,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
	} = useInfiniteQuery(
		['bookmarks', collection],
		({ pageParam = undefined }: { pageParam?: string }) =>
			readBookmarks(
				credentials?.sessionToken || '',
				pageParam,
				!Array.isArray(collection) ? collection : undefined,
				10,
				credentials?.profile.pinterest_auth_tokens?.accessToken,
				credentials?.profile.reddit_auth_tokens?.accessToken
			),
		{
			getNextPageParam: ({
				data: {
					data: {
						paginationData: { cursor },
					},
				},
			}) => (cursor === -1 ? undefined : cursor),
			refetchOnWindowFocus: false,
			retry: 2,
		}
	)
	const extractedBookmarks = useExtractBookmarks(bookmarksQueries)
	const [dataToDisplay, setDataToDisplay] = useState(extractedBookmarks)
	const lastCardRef = useRef<HTMLDivElement | null>(null)
	const entry = useIntersectionObserver(
		lastCardRef,
		{
			threshold: 0,
			rootMargin: '0%',
			root: null,
		},
		[dataToDisplay]
	)
	const twoColumns = useMediaQuery('(max-width: 1280px)')
	const oneColumn = useMediaQuery('(max-width: 1024px)')
	const [lengthState, setLength] = useState<number | null>(null)
	const { sourceSelect, ascending } = useContext(FilterContext)

	const bookmarksLengthhandler = (length: number) => {
		setLength(length)
	}
	const handleSignIn = (client: string) => {
		router.push(getAuthLink(client, credentials?.profile?.profile_id))
	}
	useEffect(() => {
		if (localStorage.getItem('theme')) {
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
		}
	}, [])

	useEffect(() => {
		if (entry && entry.isIntersecting && hasNextPage) {
			fetchNextPage()
		}
	}, [fetchNextPage, entry?.isIntersecting])

	useEffect(() => {
		if (extractedBookmarks) {
			bookmarksLengthhandler(extractedBookmarks.length)
		}
	}, [JSON.stringify(extractedBookmarks)])

	useEffect(() => {
		if (!extractedBookmarks?.length) return
		const newSources =
			Object.keys(sourceSelect).filter((item) => sourceSelect[item]) || []
		let newData = extractedBookmarks
			.filter((item) =>
				newSources.length
					? newSources.includes(item.bookmark_source)
					: true
			)
			.sort((a, b) => {
				return ascending
					? a.createdAt.localeCompare(b.createdAt)
					: b.createdAt.localeCompare(a.createdAt)
			})
		if (archive) {
			newData = newData.filter((item) => item.archive_status)
		}
		setDataToDisplay(newData)
	}, [
		JSON.stringify(sourceSelect),
		JSON.stringify(extractedBookmarks),
		archive,
	])

	if (isError || hasExpired)
		return (
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] dark:text-white'>
				<Sidebar />
				<div className='md:ml-56 flex flex-col px-4 items-center min-h-screen justify-center'>
					<div className='py-2 text-xl'>Error fetching Bookmarks</div>
					<div
						className='err-button px-6'
						onClick={() => {
							handleSignIn('twitter')
						}}
					>
						<TwitterIcon width='30' height='30' />
						<p className=' text-textprimary dark:text-white text-lg font-medium w-full cursor-pointer pl-2'>
							Retry
						</p>
					</div>
				</div>
			</div>
		)

	if (
		credentials?.profile.pinterest_auth_tokens?.accessToken === undefined &&
		credentials?.profile.twitter_auth_tokens?.accessToken === undefined &&
		credentials?.profile.reddit_auth_tokens?.accessToken === undefined
	) {
		return (
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] min-h-screen'>
				<Sidebar />
				<div className='px-8 py-16 md:ml-56 flex flex-col items-center '>
					<ConnectAccount />
				</div>
			</div>
		)
	}

	if (lengthState === 0 && !isLoading) {
		return (
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] min-h-screen'>
				<Sidebar />
				<div className='px-8 py-16 md:ml-56 flex flex-col items-center'>
					{!collection ? <ConnectAccount2 /> : <NoBookmark />}
				</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21]'>
				<Sidebar />
				<div className='px-[48px] py-8 md:ml-56 flex flex-col items-center mt-[8rem] md:mt-[60px] min-h-screen'>
					{isLoading ? (
						<MasonryLayout
							columnContents={getColumns(
								Array.from(Array(9)).map((_, index) => (
									<Box key={index} width='full'>
										<Skeleton
											height={(() =>
												`${randomNumber(15, 25)}rem`)()}
											width='full'
											borderRadius='10px'
										/>
									</Box>
								)),
								(() => {
									if (oneColumn) {
										return 1
									}
									if (twoColumns) {
										return 2
									}
									return 3
								})()
							)}
							gap='20px'
						/>
					) : (
						dataToDisplay &&
						(() => {
							const bookmarks = dataToDisplay.map(
								(bookmark, index) =>
									getCard(
										bookmark,
										index === dataToDisplay.length - 1,
										lastCardRef
									)
							)
							return (
								<MasonryLayout
									columnContents={getColumns(
										bookmarks,
										(() => {
											if (oneColumn) {
												return 1
											}
											if (twoColumns) {
												return 2
											}
											return 3
										})()
									)}
									gap='15px'
								/>
							)
						})()
					)}
					{isFetchingNextPage && (
						<div className='text-center font-bold my-8 opacity-80'>
							<Spinner color='black.500' size='lg' />
						</div>
					)}
				</div>
			</div>
		</>
	)
}

const ProtectedDashboard = withAuth(Dashboard, undefined, true, '/')

const AnalyticsEnabledProtectedDashboard =
	withPostHogAnalytics(ProtectedDashboard)

export default AnalyticsEnabledProtectedDashboard
