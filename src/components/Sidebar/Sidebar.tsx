/* eslint-disable tailwindcss/no-custom-classname */
import { Avatar } from '@chakra-ui/react'
import { createPopper } from '@popperjs/core'
import { useRouter } from 'next/router'
import {
	ArchiveBox,
	CaretDown,
	CaretRight,
	Gear,
	SignOut,
} from 'phosphor-react'
import { createRef, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import { readFavourites } from '@/apis'
import { CustomLink } from '@/components'
import { TwitterIcon } from '@/components/Icons/TwitterIcon'
import { useAuth } from '@/contexts'
import { AuthActionTypes, AuthStatus } from '@/types'
import { getAuthLink, postLogoutActions } from '@/utils'

import Favourites from '../Favourites/Favourites'
import Navbar from '../Navbar/Navbar'
import Tags from '../Tags/Tags'

const Sidebar = () => {
	const [isfavOpen, setIsfavOpen] = useState(false)
	const [favData, setFavData] = useState([])
	const [favError, setFavError] = useState(false)
	const {
		authDispatch,
		auth: { credentials },
	} = useAuth()
	useEffect(() => {
		;(async () => {
			try {
				await readFavourites().then((res) => {
					if (res.status === 200 && res.data.bookmarks.length > 0) {
						setIsfavOpen(true)
						setFavData(res.data.bookmarks)
					}
					return []
				})
			} catch (error) {
				setFavError(true)
			}
		})()
	}, [])
	const router = useRouter()

	const [showSidebar, setShowSidebar] = useState('-left-56')
	const [Caretopen, setCaretopen] = useState(false)
	const [popperinstance, setPopperinstance] = useState<any>(null)
	const caretRef = createRef<any>()
	const caretPopoverRef = createRef<any>()

	const handleCaretPopOver = () => {
		if (popperinstance) {
			setCaretopen(false)
			popperinstance.destroy()
			setPopperinstance(null)
		} else {
			setCaretopen(true)
			const instance = createPopper(
				caretRef.current!,
				caretPopoverRef.current!,
				{
					placement: 'bottom',
				}
			)
			setPopperinstance(instance)
		}
	}
	const handleSignIn = (client: string) => {
		router.push(getAuthLink(client, credentials?.profile?.profile_id))
	}
	if (favError) {
		return (
			<div className='font-Karla h-[100%] dark:bg-[#111834] dark:text-white fixed items-center text-center top-0 bg-white md:left-0 border-bordersidebarsettings overflow-y-auto flex-row flex-nowrap overflow-hidden w-56 z-20 border-solid border-[0.5px] transition-all duration-300'>
				<div className='flex flex-col px-4'>
					<div className='py-2'>Error fetching favorites</div>
					<div className='pb-2 self-center'>Retry Login</div>
					<div
						className='err-button px-6 w-full'
						onClick={() => {
							handleSignIn('twitter')
						}}
					>
						<TwitterIcon width='30' height='30' />
						<p className=' text-textprimary dark:text-white text-lg font-medium w-full cursor-pointer'>
							Retry
						</p>
					</div>
				</div>
			</div>
		)
	}
	return credentials ? (
		<>
			<Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
			<div
				className={`font-Karla h-[100%] fixed top-0 bg-white dark:bg-[#111834] dark:text-textdark md:left-0 ${showSidebar} border-bordersidebarsettings dark:border-borderdarkcard overflow-y-auto flex-row flex-nowrap overflow-hidden w-56 z-20 border-solid border-[0.5px] transition-all duration-300`}
			>
				<div className='flex-col items-stretch min-h-full flex-nowrap px-0 relative w-full'>
					<div className='flex gap-2 text-lg py-4 pl-8 mb-[20px] items-center border-b-[0.4px] border-[#70707033] w-full'>
						{credentials.profile?.profile_image ? (
							<Avatar
								src={credentials.profile.profile_image}
								size='md'
							/>
						) : (
							<Avatar size='md' />
						)}
						<button
							className='text-control w-[min(5ch,_30%)]'
							onClick={handleCaretPopOver}
						>
							{credentials.profile.name ||
								credentials.profile.twitter_username ||
								credentials.profile.pinterest_username ||
								credentials.profile.reddit_username}
						</button>
						<div className='relative pr-3'>
							{Caretopen ? (
								<CaretDown
									size={20}
									className='cursor-pointer'
									onClick={() => setCaretopen(!Caretopen)}
								/>
							) : (
								<CaretRight
									size={20}
									className='cursor-pointer'
									onClick={handleCaretPopOver}
									ref={caretRef}
								/>
							)}
							{Caretopen && (
								<OutsideClickHandler
									onOutsideClick={() => setCaretopen(false)}
								>
									<div
										className='shadow-3xl dark:shadow-none top-[calc(100%+20px)] bg-[#FBFBFB]  rounded-[6px] border-solid border-[0.4px] border-[#70707033] dark:bg-[#0A0F21] dark:border-[#70707099] dark:text-[#FBFBFB] mr-3 w-36 text-left absolute -right-1 text-[#0A1334] py-[12px] px-1 z-10'
										ref={caretPopoverRef}
									>
										<div>
											<div className='text-textprimary dark:text-textdark font-Karla text-[16px] font-medium'>
												<CustomLink href='/settings/workspace'>
													<span className='px-3 py-1 flex mb-2 cursor-pointer items-center hover:bg-[#707070]/20'>
														<Gear size={20} />
														<span className='pl-2 cursor-pointer'>
															Settings
														</span>
													</span>
												</CustomLink>
												<button
													className='px-3 py-1 flex cursor-pointer gap-2 items-center w-full hover:bg-[#707070]/20'
													onClick={() => {
														authDispatch({
															type: AuthActionTypes.UNAUTHENTICATE,
															payload: {
																authStatus:
																	AuthStatus.UNAUTHENTICATED,
																credentials:
																	null,
															},
														})
														postLogoutActions(true)
														localStorage.removeItem(
															'email'
														)
														localStorage.removeItem(
															'theme'
														)
													}}
												>
													<SignOut size={20} /> Log
													out
												</button>
											</div>
										</div>
									</div>
								</OutsideClickHandler>
							)}
						</div>
					</div>
					{isfavOpen && !favError && <Favourites dataFav={favData} />}
					{favData?.length === 0 ? (
						<Tags height='h-[700px] sm:h-[600px] md:h-[320px]' />
					) : (
						<Tags height='h-[500px] sm:h-[400px] md:h-[224px]' />
					)}
					<CustomLink
						href={
							router.query.archive
								? '/dashboard'
								: '/dashboard?archive=true'
						}
						className='flex text-xl px-10 py-4 absolute bottom-0 items-center border-t-[0.4px] border-[#70707033] w-full h-16 cursor-pointer z-30'
					>
						<ArchiveBox weight='thin' size={26} className='mr-2' />{' '}
						Archive
					</CustomLink>
				</div>
			</div>
		</>
	) : (
		<div className='font-Karla h-[100%] fixed items-center text-center top-0 bg-white dark:bg-[#111834] dark:text-white md:left-0 border-bordersidebarsettings overflow-y-auto flex-row flex-nowrap overflow-hidden w-56 z-20 border-solid border-[0.5px] transition-all duration-300'>
			<p className='self-center py-2'>Unable to Authenticate</p>
			<div
				className='err-button px-4 w-full'
				onClick={() => {
					router.push('/')
				}}
			>
				<p className=' text-textprimary dark:text-white text-lg font-medium w-full cursor-pointer'>
					Retry
				</p>
			</div>
		</div>
	)
}

export default Sidebar
