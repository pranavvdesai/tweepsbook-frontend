/* eslint-disable no-console */
/* eslint-disable tailwindcss/no-custom-classname */
import { Avatar, Tooltip } from '@chakra-ui/react'
import { createPopper } from '@popperjs/core'
import {
	Funnel,
	FunnelSimple,
	List,
	MagnifyingGlass,
	PinterestLogo,
	PlusCircle,
	SortAscending,
	SortDescending,
	X,
} from 'phosphor-react'
import { useContext, useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import OutsideClickHandler from 'react-outside-click-handler'

import { querySearched } from '@/analytics'
import { useAuth } from '@/contexts'
import type { BasicBookmark } from '@/types'
import { TweepsbookSources } from '@/types'
import { typesenseClient } from '@/utils'

import { FilterContext } from '../../contexts/filter.context'
import { CreateBookmarkMenu } from '../create_bookmark_menu/CreateBookmarkMenu'
import { CustomLink } from '../custom_link/CustomLink'
import { RedditIcon } from '../Icons'
import ArticleIcon from '../Icons/ArticleIcon'
import { TwitterIcon } from '../Icons/TwitterIcon'

const source = Object.values(TweepsbookSources)

const typesenseBookmarksSearchParams = {}

const Navbar = (props: any) => {
	const {
		auth: { credentials },
	} = useAuth()
	const [filter, setFilter] = useState<boolean>(false)
	const [sort, setSort] = useState<boolean>(false)
	const [add, setAdd] = useState<boolean>(false)
	const [searchResults, setSearchResults] = useState<BasicBookmark[]>([])
	const [searchedQuery, setSearchedQuery] = useState<string>('')
	const [popperinstance, setPopperInstance] = useState<any>(null)
	// const [isSearch, setIsSearch] = useState(false)
	const [searchbarExpand, setSearchbarExpand] = useState<boolean>(false)
	const searchbarRef = useRef<HTMLDivElement | null>(null)
	const searchbarPopoverRef = useRef<HTMLDivElement | null>(null)
	const filterBtnRef = useRef<HTMLButtonElement | null>(null)
	const filterPopoverRef = useRef<HTMLDivElement | null>(null)
	const sortBtnRef = useRef<HTMLButtonElement | null>(null)
	const sortPopoverRef = useRef<HTMLDivElement | null>(null)
	const addBtnRef = useRef<HTMLButtonElement | null>(null)
	const addPopoverRef = useRef<HTMLDivElement | null>(null)
	const { sourceSelect, setSourceSelect, setAscending, ascending } =
		useContext(FilterContext)

	useEffect(() => {
		;(async () => {
			try {
				if (searchedQuery.length > 1) {
					const bookmarksDoc = await typesenseClient
						.collections('bookmarks')
						.documents()
					const result = await bookmarksDoc.search({
						...typesenseBookmarksSearchParams,
						q: searchedQuery,
						query_by: 'post_data',
					})
					const bookmarkResults = result.hits
						? (result.hits.map(
								(hit) => hit.document
						  ) as BasicBookmark[])
						: []
					const userBookmarks = bookmarkResults.filter(
						(bookmark, index) =>
							bookmark.profile_id ===
							credentials?.profile.profile_id
					)
					setSearchResults(userBookmarks)
				}
			} catch (err) {
				console.error(err)
			}
		})()
	}, [searchedQuery])

	const handleFilterPopOver = () => {
		setFilter((prev) => !prev)
		createPopper(
			filterBtnRef.current as HTMLButtonElement,
			filterPopoverRef.current as HTMLDivElement,
			{
				placement: 'bottom',
			}
		)
	}

	const handleSortPopOver = () => {
		setSort((prev) => !prev)
		createPopper(
			sortBtnRef.current as HTMLButtonElement,
			sortPopoverRef.current as HTMLDivElement,
			{
				placement: 'bottom',
			}
		)
	}

	const handleAddPopOver = () => {
		setAdd((prev) => !prev)
		createPopper(
			addBtnRef.current as HTMLButtonElement,
			addPopoverRef.current as HTMLDivElement,
			{
				placement: 'bottom',
			}
		)
	}
	const handleSearchbarExpand = () => {
		setSearchbarExpand(true)
		// setIsSearch(true)
		const instance = createPopper(
			searchbarRef.current!,
			searchbarPopoverRef.current!,
			{
				placement: 'bottom',
			}
		)
		setPopperInstance(instance)
	}

	const handleSearchbarCollapse = () => {
		setSearchResults([])
		setSearchedQuery('')
		setSearchbarExpand(false)
		// setIsSearch(false)
		if (popperinstance) popperinstance.destroy()
	}
	const getIcon = (tweepsSource: TweepsbookSources) => {
		if (tweepsSource === TweepsbookSources.PINTEREST) {
			return (
				<PinterestLogo
					size={30}
					weight='fill'
					className='text-[#CB1F27]'
				/>
			)
		}
		if (tweepsSource === TweepsbookSources.REDDIT) {
			return <RedditIcon width='20' height='20' />
		}
		if (tweepsSource === TweepsbookSources.TWITTER) {
			return <TwitterIcon width='23' height='18' />
		}
		return <ArticleIcon width='20' height='22' />
	}

	return (
		<div className='px-12 font-[Karla] h-[8rem] w-full fixed top-0 bg-white dark:bg-[#111834] border-b-[0.4px] border-[#70707033] md:h-[60px] z-20'>
			<div className='flex justify-between items-center md:hidden'>
				<List
					size={32}
					onClick={() => {
						props.setShowSidebar(
							props.showSidebar === '-left-56'
								? 'left-0'
								: '-left-56'
						)
					}}
					className='md:hidden my-6 cursor-pointer dark:text-[#F5F5F5]'
				/>
				{credentials?.profile?.profile_image ? (
					<Avatar
						src={credentials?.profile.profile_image}
						size='sm'
					/>
				) : (
					<Avatar size='sm' />
				)}
			</div>
			<OutsideClickHandler
				onOutsideClick={() => {
					setSearchResults([])
					setSearchedQuery('')
					setSearchbarExpand(false)
					// setIsSearch(false)
					if (popperinstance) popperinstance.destroy()
				}}
			>
				<div className='flex justify-between md:h-full md:ml-56'>
					<div className='relative flex w-full items-center md:pt-2'>
						<div className='relative md:w-full'>
							<MagnifyingGlass
								size={26}
								className='absolute sm:h-auto h-[1.5rem] top-[6px] left-[6px] text-[#70707099] dark:text-[#CECECE]/60 md:top-[5px] md:left-[12px]'
							/>
							<input
								value={searchedQuery}
								onChange={(e) => {
									setSearchedQuery(e.target.value)
									querySearched(e.target.value)
								}}
								placeholder='Search Keyword, Tag, Author'
								className={`md:text-[16px] dark:text-white focus:outline-none h-[36px] text-sm bg-[#F7F7F7] dark:bg-[#0A0F21] rounded border-[1.4px] border-[#70707044] pl-11 md:pl-12 placeholder:text-[#70707099] dark:placeholder:text-[#CECECE]/60 ${
									searchbarExpand
										? 'shadow-3xl dark:shadow-none duration-500 md:w-[100%] w-[22rem]'
										: 'w-[15rem] duration-500 md:w-[20rem]'
								} `}
								onClick={handleSearchbarExpand}
							/>
							{searchbarExpand && (
								<X
									size={22}
									className='absolute duration-500 sm:h-auto h-[1.5rem] top-[6px] right-[6px] text-[#70707099] dark:text-[#CECECE]/60 md:top-[7px] md:right-[12px] cursor-pointer'
									onClick={handleSearchbarCollapse}
								/>
							)}
						</div>
						{searchResults.length > 0 && (
							<div
								className={` ${
									searchResults.length >= 3
										? `h-[100px]`
										: `h-auto`
								} scrollbar dark:scrollbar-dark top-[calc(100%+1px)] mt-1 bg-[#FBFBFB] dark:bg-[#0A0F21] shadow-bordersearchbar rounded-[6px] overflow-y-auto border-solid border-[0.4px] border-[#70707033] dark:border-[#70707099] md:w-full w-[22rem] text-left absolute text-[#0A1334] dark:text-[#CECECE] z-10`}
								ref={searchbarPopoverRef}
							>
								{searchResults.map((bookmark, index) => (
									<CustomLink
										key={index}
										// @ts-ignore
										href={`/${credentials?.profile.workspace_username}/document/${bookmark.id}`}
									>
										<div className='flex flex-col font-Karla'>
											<div className='flex items-center border-b border-[#70707033] p-2 py-3'>
												{getIcon(
													bookmark.bookmark_source
												) ? (
													<>
														{getIcon(
															bookmark.bookmark_source
														)}
													</>
												) : (
													<></>
												)}
												<h1 className='text-control dark:text-[#FBFBFB]text-control ml-2 font-medium xl:text-base md:text-sm text-xs hover:cursor-pointer'>
													{bookmark.bookmark_source}
												</h1>
												<span className='bullet mx-2' />
												<h1 className='text-control text-[#707070] dark:text-[#CECECE] xl:text-[16px] text-[12px] font-semibold hover:cursor-pointer'>
													<Highlighter
														highlightClassName='dark:bg-white bg-black text-white'
														searchWords={[
															searchedQuery,
														]}
														autoEscape={true}
														textToHighlight={
															bookmark.post_heading
														}
														className=' max-w-[min(40ch,_45%)'
													/>
												</h1>
												<span className='bullet md:block hidden mx-2' />
												<h1 className=' text-[#707070] max-w-[min(40ch,_45%)] xl:max-w-[min(50ch,_65%)] dark:text-[#CECECE] xl:text-[16px] md:block hidden text-[12px] font-medium overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer'>
													<Highlighter
														highlightClassName='dark:bg-white bg-black text-white'
														searchWords={[
															searchedQuery,
														]}
														autoEscape={true}
														textToHighlight={
															bookmark.post_data
														}
														className=' max-w-[min(40ch,_45%)'
													/>
												</h1>
											</div>
										</div>
									</CustomLink>
								))}
							</div>
						)}
					</div>
					<div
						className={`${
							searchbarExpand ? 'hidden' : ''
						} flex justify-between items-center md:pt-4`}
					>
						<div className='relative'>
							{add ? (
								<PlusCircle
									size={28}
									weight='fill'
									className='self-center mr-4 cursor-pointer dark:text-[#F5F5F5]'
									onClick={() => setAdd((prev) => !prev)}
								/>
							) : (
								<Tooltip
									label='Add a custom link'
									bg='#F5F5F5'
									color='#0A1334'
								>
									<button
										className='self-center mr-4 cursor-pointer dark:text-[#F5F5F5]'
										onClick={handleAddPopOver}
										ref={addBtnRef}
									>
										<PlusCircle size={28} weight='thin' />
									</button>
								</Tooltip>
							)}
							{add && (
								<OutsideClickHandler
									onOutsideClick={() => setAdd(false)}
								>
									<CreateBookmarkMenu
										addPopoverRef={addPopoverRef}
										closeClickHandler={() => setAdd(false)}
									/>
								</OutsideClickHandler>
							)}
						</div>
						<div className='relative'>
							{filter ? (
								<Funnel
									size={28}
									className='self-center mr-4 cursor-pointer dark:text-[#F5F5F5]'
									weight='fill'
									onClick={() => setFilter((prev) => !prev)}
								/>
							) : (
								<Tooltip
									label='Filter by'
									bg='#F5F5F5'
									color='#0A1334'
								>
									<button
										className='self-center mr-4 cursor-pointer dark:text-[#F5F5F5]'
										onClick={handleFilterPopOver}
										ref={filterBtnRef}
									>
										<Funnel size={28} weight='thin' />
									</button>
								</Tooltip>
							)}
							{filter && (
								<OutsideClickHandler
									onOutsideClick={() => setFilter(false)}
								>
									<div
										className='shadow-lg dark:shadow-none top-[calc(100%+7px)] bg-[#FFFFFF] rounded-[4px] border-[0.4px] border-[#70707033] dark:bg-[#0A0F21] dark:border-[#70707099] dark:text-[#FBFBFB] mr-3 w-[170px] text-left absolute right-[5px] text-[#0A1334] p-[12px]'
										ref={filterPopoverRef}
									>
										{/* <Accordion allowMultiple allowToggle>
											<h1 className='text-[18px]'>
												Filter by
											</h1>
											<AccordionItem border='none'>
												{({ isExpanded }) => (
													<>
														<h2>
															<AccordionButton
																pb='unset'
																pl='unset'
															>
																<Box className='text-left text-[16px]'>
																	Source
																</Box>
																{isExpanded ? (
																	<CaretDown
																		size={
																			15
																		}
																	/>
																) : (
																	<CaretRight
																		size={
																			15
																		}
																	/>
																)}
															</AccordionButton>
														</h2>
														<AccordionPanel
															py='unset'
															px='unset'
														>
															{source.map(
																(e, i) => (
																	<div
																		className={`${
																			!sourceSelect[
																				e
																			]
																				? 'text-[#70707088]'
																				: ''
																		} flex justify-between text-[#0A1334] text-[16px]`}
																		key={i}
																	>
																		<label className='first-letter:capitalize'>
																			{e}
																		</label>
																		<input
																			type='checkbox'
																			className='accent-[#0A1334] border-[#70707077] cursor-pointer'
																			onChange={() =>
																				setSourceSelect(
																					(
																						prev
																					) => ({
																						...prev,
																						[e]: !prev[
																							e
																						],
																					})
																				)
																			}
																			checked={
																				sourceSelect[
																					e
																				]
																			}
																		/>
																	</div>
																)
															)}
														</AccordionPanel>
													</>
												)}
											</AccordionItem>
											<AccordionItem border='none'>
												{({ isExpanded }) => (
													<>
														<h2>
															<AccordionButton
																pb='unset'
																pl='unset'
															>
																<Box className='text-left text-[16px]'>
																	Keyword
																</Box>
																{isExpanded ? (
																	<CaretDown
																		size={
																			15
																		}
																	/>
																) : (
																	<CaretRight
																		size={
																			15
																		}
																	/>
																)}
															</AccordionButton>
														</h2>
														<AccordionPanel
															py='unset'
															px='unset'
														>
															<div className='relative mt-[10px]'>
																<MagnifyingGlass
																	size={20}
																	className='absolute top-[3.5px] left-[6px] text-[#707070]'
																/>
																<input
																	placeholder='Search Keyword'
																	className='focus:outline-none h-[28px] w-[144px] text-[13px] bg-[#F6F6F6] rounded-[2px] border-[0.2px] border-[#d9d9d9] pl-8 placeholder:text-[#707070]'
																	onChange={(
																		e
																	) =>
																		setKeyword(
																			(
																				e?.target as HTMLInputElement
																			)
																				?.value
																		)
																	}
																/>
															</div>
														</AccordionPanel>
													</>
												)}
											</AccordionItem>
											<AccordionItem border='none'>
												{({ isExpanded }) => (
													<>
														<h2>
															<AccordionButton
																pb='unset'
																pl='unset'
															>
																<Box className='text-left text-[16px]'>
																	Author
																</Box>
																{isExpanded ? (
																	<CaretDown
																		size={
																			15
																		}
																	/>
																) : (
																	<CaretRight
																		size={
																			15
																		}
																	/>
																)}
															</AccordionButton>
														</h2>
														<AccordionPanel
															py='unset'
															px='unset'
														>
															<div className='relative mt-[10px]'>
																<MagnifyingGlass
																	size={20}
																	className='absolute top-[3.5px] left-[6px] text-[#707070]'
																/>
																<input
																	placeholder='Search Author'
																	className='focus:outline-none h-[28px] w-[144px] text-[13px] bg-[#F6F6F6] rounded-[2px] border-[0.2px] border-[#d9d9d9] pl-8 placeholder:text-[#707070]'
																	onChange={(
																		e
																	) =>
																		setAuthor(
																			(
																				e?.target as HTMLInputElement
																			)
																				?.value
																		)
																	}
																/>
															</div>
														</AccordionPanel>
													</>
												)}
											</AccordionItem>
										</Accordion> */}
										<h1 className='text-[18px] mb-2'>
											Filter by
										</h1>
										<p className='text-left text-[16px] pb-1'>
											Source
										</p>
										{source.map((e, i) => (
											<div
												className={`${
													!sourceSelect[e]
														? 'text-[#70707088] dark:text-[#707070]'
														: ''
												} flex justify-between text-[#0A1334] dark:text-[#FBFBFB] text-[16px]`}
												key={i}
											>
												<label className='first-letter:capitalize'>
													{e}
												</label>
												<input
													type='checkbox'
													className='accent-[#0A1334] dark:accent-[#FBFBFB] border-[#70707077] cursor-pointer'
													onChange={() =>
														setSourceSelect(
															(prev) => ({
																...prev,
																[e]: !prev[e],
															})
														)
													}
													checked={sourceSelect[e]}
												/>
											</div>
										))}
									</div>
								</OutsideClickHandler>
							)}
						</div>
						<div className='relative'>
							{sort ? (
								<FunnelSimple
									size={28}
									weight='fill'
									className='self-center cursor-pointer dark:text-[#F5F5F5]'
									onClick={() => setSort((prev) => !prev)}
								/>
							) : (
								<Tooltip
									label='Sort by'
									bg='#F5F5F5'
									color='#0A1334'
								>
									<button
										className='self-center cursor-pointer dark:text-[#F5F5F5]'
										onClick={handleSortPopOver}
										ref={sortBtnRef}
									>
										<FunnelSimple
											size={28}
											weight='light'
										/>
									</button>
								</Tooltip>
							)}
							{sort && (
								<OutsideClickHandler
									onOutsideClick={() => setSort(false)}
								>
									<div
										className='shadow-lg dark:shadow-none top-[calc(100%+7px)] bg-[#FFFFFF] rounded-[4px] border-[0.2px] border-[#70707033] dark:bg-[#0A0F21] dark:border-[#70707099] dark:text-[#FBFBFB] mr-3 w-[190px] text-left absolute right-[5px] text-[#0A1334]'
										ref={sortPopoverRef}
									>
										<div className='p-1'>
											<h1 className='text-[18px] mb-2 px-2 pt-2'>
												Sort by
											</h1>
											<div className='text-[16px] text-[#0A1334] w-[100%]'>
												<button
													className={`${
														ascending &&
														'bg-[#707070]/10 dark:bg-[#707070]/20'
													} flex justify-between w-full py-1 px-2 dark:text-[#FBFBFB] hover:bg-[#707070]/20`}
													onClick={() =>
														setAscending(true)
													}
												>
													Date Bookmarked
													<SortAscending
														size={20}
														weight='thin'
													/>
												</button>
												<button
													className={`${
														!ascending &&
														'bg-[#707070]/10 dark:bg-[#707070]/20'
													} flex items-center justify-between w-full py-1 px-2 dark:text-[#FBFBFB] hover:bg-[#707070]/20`}
													onClick={() =>
														setAscending(false)
													}
												>
													Date Bookmarked
													<SortDescending
														size={20}
														weight='thin'
													/>
												</button>
											</div>
										</div>
									</div>
								</OutsideClickHandler>
							)}
						</div>
					</div>
				</div>
			</OutsideClickHandler>
		</div>
	)
}

export default Navbar
/*  showSidebar and setShowSidebar are passed down as
props, later can use setShowsidebar('left-0') to show sidebar when hamburger is
clicked and vice versa */
