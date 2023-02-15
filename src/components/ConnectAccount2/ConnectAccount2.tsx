import { PinterestLogo } from 'phosphor-react'
import { useRef, useState } from 'react'

import { createBookmark } from '@/apis'
import { useAuth } from '@/contexts'

import { CustomLink } from '../custom_link/CustomLink'
import { RedditIcon } from '../Icons/RedditIcon'
import { TwitterIcon } from '../Icons/TwitterIcon'

const ConnectAccount2 = () => {
	const {
		auth: { credentials },
	} = useAuth()
	const bookmarkInputRef = useRef<HTMLInputElement | null>(null)
	const [isCreatingBookmark, setIsCreatingBookmark] = useState<boolean>(false)
	const handleCreateBookmark = async () => {
		if (bookmarkInputRef.current === null) return
		if (bookmarkInputRef.current.value.replaceAll(' ', '').length === 0)
			return
		try {
			setIsCreatingBookmark(true)
			await createBookmark(bookmarkInputRef.current.value)
			bookmarkInputRef.current.value = ''
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
		} finally {
			setIsCreatingBookmark(false)
		}
	}
	return (
		<div className='flex flex-col bg-white dark:bg-[#111834] dark:text-textdark mx-10 my-2 w-full mt-[8rem] md:mt-[40px] font-Karla p-6 border-[0.2px] border-solid border-[#70707033] shadow-4xl dark:shadow-none  rounded-lg'>
			<p className='text-2xl'>
				Oops 😕, seems like you haven’t bookmarked anything on{' '}
				{credentials?.profile?.twitter_auth_tokens?.accessToken &&
					'Twitter, '}
				{credentials?.profile?.reddit_auth_tokens && 'Reddit, '}
				{credentials?.profile?.pinterest_auth_tokens && 'Pinterest '}
				yet. You can begin by bookmarking something.
			</p>
			<div className='flex flex-wrap gap-9 mt-[25px]'>
				{credentials?.profile?.twitter_auth_tokens?.accessToken && (
					<div className='flex justify-between px-4 py-3 gap-3 bg-[#FFFFFF] dark:bg-[#111834] dark:text-textdark border-[#CECECE] border-[0.4px] rounded-[8px] w-[365px]'>
						<div className='flex justify-center items-center xs:gap-4 gap-2'>
							<div>
								<TwitterIcon width='42' height='42' />
							</div>
							<div>
								<h1 className='text-[#0A1334] dark:text-textdark text-xl font-[600] '>
									Twitter
								</h1>
								<p className='text-[#707070] dark:text-[#CECECE80] text-[15px] font-[400] '>
									@{credentials?.profile?.twitter_username}
								</p>
							</div>
						</div>
						<div className='flex justify-center items-center'>
							<CustomLink
								target='_blank'
								// href={getAuthLink(
								// 	client,
								// 	credentials?.profile.profile_id
								// )}
								href={`https://twitter.com/${credentials?.profile?.twitter_username}`}
								className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px] text-xs xs:text-base '
							>
								Open Twitter
							</CustomLink>
						</div>
					</div>
				)}
				{credentials?.profile?.reddit_auth_tokens?.accessToken && (
					<div className='flex justify-between px-4 py-3 gap-3 bg-[#FFFFFF] dark:bg-[#111834] dark:text-textdark border-[#CECECE] border-[0.4px] rounded-[8px] w-[365px]'>
						<div className='flex justify-center items-center gap-4'>
							<div>
								<RedditIcon width='42' height='42' />
							</div>
							<div>
								<h1 className='text-[#0A1334] dark:text-textdark text-xl font-[600] '>
									Reddit
								</h1>
								<p className='text-[#707070] dark:text-[#CECECE80] text-[15px] font-[400] '>
									{credentials?.profile?.reddit_username}
								</p>
							</div>
						</div>
						<div className='flex justify-center items-center'>
							<CustomLink
								target='_blank'
								// href={getAuthLink(
								// 	e.client,
								// 	credentials?.profile.profile_id
								// )}
								href={`https://reddit.com/${credentials?.profile?.reddit_username}`}
								className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px] text-xs xs:text-base'
							>
								Open Reddit
							</CustomLink>
						</div>
					</div>
				)}
				{credentials?.profile?.pinterest_auth_tokens?.accessToken && (
					<div className='flex justify-between px-4 py-3 gap-3 bg-[#FFFFFF] dark:bg-[#111834] dark:text-textdark border-[#CECECE] border-[0.4px] rounded-[8px] w-[365px]'>
						<div className='flex justify-center items-center gap-4'>
							<div>
								<PinterestLogo
									size={44}
									weight='fill'
									className='text-[#CB1F27]'
								/>
							</div>
							<div>
								<h1 className='text-[#0A1334] dark:text-textdark text-xl font-[600] '>
									Pinterest
								</h1>
								<p className='text-[#707070] dark:text-[#CECECE80] text-[15px] font-[400] '>
									@{credentials?.profile.pinterest_username}
								</p>
							</div>
						</div>
						<div className='flex justify-center items-center'>
							<CustomLink
								target='_blank'
								// href={getAuthLink(
								// 	e.client,
								// 	credentials?.profile.profile_id
								// )}
								href={`https://pinterest.com/${credentials?.profile?.pinterest_username}`}
								className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px] text-xs xs:text-base'
							>
								Open Pinterest
							</CustomLink>
						</div>
					</div>
				)}
			</div>
			<div className='mt-[25px] flex flex-col gap-2 xs:w-[365px] w-full'>
				<p className=' text-lg'>
					<span className='font-extrabold'>OR</span> paste any Link
				</p>
				<input
					type='url'
					ref={bookmarkInputRef}
					className=' bg-transparent focus:outline-none h-[30px] border-[0.2px] p-2 py-4 border-solid border-[#70707033] dark:border-[#CECECE] mb-2 rounded-sm'
				/>
				<button
					className=' text-[#FFFFFF] text-[18px] bg-[#0A1334] dark:text-[#0A1334] dark:bg-[#F6F6F6] rounded-[2px] border-[0.2px] border-[#70707033] py-1'
					onClick={handleCreateBookmark}
				>
					{isCreatingBookmark ? 'Creating bookmark...' : 'Bookmark'}
				</button>
			</div>
		</div>
	)
}

export default ConnectAccount2
