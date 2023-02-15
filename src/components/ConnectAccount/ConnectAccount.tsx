import { useRouter } from 'next/router'
import { PinterestLogo } from 'phosphor-react'
import { useRef, useState } from 'react'

import { createBookmark } from '@/apis'
import { useAuth } from '@/contexts'
import { getAuthLink } from '@/utils'

import { RedditIcon } from '../Icons/RedditIcon'
import { TwitterIcon } from '../Icons/TwitterIcon'

const data = [
	{
		icon: <TwitterIcon width='42' height='42' />,
		title: 'Twitter',
		handle: '@chrisdoe',
		connected: false,
		client: 'twitter',
	},
	{
		icon: <RedditIcon width='42' height='42' />,
		title: 'Reddit',
		handle: 'u/canarycan',
		connected: false,
		client: 'reddit',
	},

	{
		icon: (
			<PinterestLogo size={46} weight='fill' className='text-[#CB1F27]' />
		),
		title: 'Pinterest',
		handle: '@chrisdoe',
		connected: true,
		client: 'pinterest',
	},
]

const ConnectAccount = () => {
	const router = useRouter()

	const {
		auth: { credentials },
	} = useAuth()
	const bookmarkInputRef = useRef<HTMLInputElement | null>(null)
	const [isCreatingBookmark, setIsCreatingBookmark] = useState<boolean>(false)
	const handleSignIn = (client: string, cred: string | undefined) => {
		router.push(getAuthLink(client, cred))
	}
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
		<div className='flex flex-col bg-white dark:bg-[#111834] dark:text-textdark mx-10 my-2 w-full mt-[8rem] md:mt-[40px] font-Karla p-6 border-[0.2px] border-solid border-[#70707033] shadow-4xl dark:shadow-none rounded-lg'>
			<p className='text-2xl'>
				Oops 😕, seems like you haven't bookmarked anything on this
				platform yet. Please authenticate another platform where you have
				stored some bookmarks.
			</p>
			<div className='flex flex-wrap gap-9 mt-[25px]'>
				{data.map((e, i) => {
					return (
						<div
							className='flex justify-between px-4 py-3 gap-3 bg-[#FFFFFF] dark:bg-[#111834] dark:text-textdark border-[#CECECE] border-[0.4px] rounded-[8px] xs:w-[365px] w-full'
							key={i}
						>
							<div className='flex justify-center items-center xs:gap-4 gap-2'>
								<div>{e.icon}</div>
								<div>
									<h1 className='text-[#0A1334] dark:text-textdark xs:text-xl text-lg font-[600] '>
										{e.title}
									</h1>
									{/* {!e.connected && (
										<p className='text-[#707070] xs:text-[15px] text-[12px] font-[400] '>
											{e.handle}
										</p>
									)} */}
								</div>
							</div>
							<div className='flex justify-center items-center'>
								<div
									onClick={() => {
										handleSignIn(
											e.client,
											credentials?.profile?.profile_id
										)
									}}
									className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px] text-xs xs:text-base cursor-pointer'
								>
									Connect
								</div>
							</div>
						</div>
					)
				})}
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

export default ConnectAccount
