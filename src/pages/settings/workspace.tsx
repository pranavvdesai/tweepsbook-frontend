import type { UseToastOptions } from '@chakra-ui/react'
import { Spinner, Switch, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import {
	checkEmailDisposability,
	readAccount,
	sendOtpToUpdateEmail,
	updateAccount,
} from '@/apis'
import { Backdrop, UpdateOtpModal } from '@/components'
import { withAuth, withPostHogAnalytics } from '@/components/hoc'
import SidebarSettings from '@/components/SidebarSettings/SidebarSettings'
import { useAuth } from '@/contexts'
import { AuthActionTypes, AuthStatus } from '@/types'

import avatar from '../../../public/avatar.png'

const Workspace = () => {
	const { auth, authDispatch } = useAuth()
	const [isOtpBoxActive, setIsOtpBoxActive] = useState<boolean>(false)
	const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false)
	const [lightMode, setLightMode] = useState<boolean>(
		localStorage.getItem('theme') === 'light' || true
	)
	const nameInputRef = useRef<HTMLInputElement | null>(null)
	const [emailInput, setEmailInput] = useState<string>('')
	const usernameInputRef = useRef<HTMLInputElement | null>(null)
	const [themeStorage, setThemeStorage] = useState<string>(
		localStorage.getItem('theme') || 'light'
	)
	const toast = useToast()

	const Toast = (
		description: string,
		title: string,
		status: UseToastOptions['status']
	) => {
		toast({
			title,
			description,
			status,
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

	const handleTheme = () => {
		localStorage.setItem('theme', lightMode ? 'dark' : 'light')
		setLightMode(!lightMode)
		setThemeStorage(localStorage.getItem('theme') || 'light')
		if (lightMode === false) {
			document.body.classList.remove('dark')
		} else {
			document.body.classList.add('dark')
		}
	}
	// eslint-disable-next-line no-console
	console.log(lightMode)

	useEffect(() => {
		setEmailInput(auth.credentials?.profile.email || '')
		if (localStorage.getItem('theme')) {
			setThemeStorage(localStorage.getItem('theme') || 'light')
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
			setLightMode(localStorage.getItem('theme') === 'light')
		}
	}, [auth.credentials?.profile.email])

	const handleSendOTP = async () => {
		try {
			setIsSavingChanges(true)
			const {
				data: { disposable },
			} = await checkEmailDisposability(emailInput)
			if (disposable === false) {
				Toast(
					'Cannot send OTP to this email. Please enter another email.',
					'Invalid email.',
					'error'
				)
				return
			}
			await sendOtpToUpdateEmail(emailInput)
			Toast(
				'We have sent an OTP to your new email.',
				'OTP sent.',
				'success'
			)
			setIsOtpBoxActive(true)
		} catch (err) {
			Toast(
				'Could not send OTP to your new email. Please try again later.',
				'Failed to send OTP.',
				'error'
			)
		} finally {
			setIsSavingChanges(false)
		}
	}

	const handleSaveChanges = async () => {
		try {
			setIsSavingChanges(true)
			if (auth.credentials?.profile.email !== emailInput) {
				await handleSendOTP()
			} else {
				await (async () => {
					const name =
						nameInputRef.current?.value !==
						auth.credentials?.profile.name
							? nameInputRef.current?.value
							: undefined
					const username =
						usernameInputRef.current?.value !==
						auth.credentials?.profile.workspace_username
							? usernameInputRef.current?.value
							: undefined
					try {
						if (auth.credentials?.sessionToken) {
							await updateAccount(
								auth.credentials?.sessionToken,
								undefined,
								name,
								username
							)
						}
					} catch (err) {
						Toast(
							'Something went wrong.',
							'We could not update your account at moment. Please try again later.',
							'error'
						)
					}
				})()
				await (async () => {
					const sessionToken = auth.credentials?.sessionToken
					if (sessionToken === undefined) return
					try {
						const { data: profile } = await readAccount(
							sessionToken
						)
						authDispatch({
							type: AuthActionTypes.AUTHENTICATE,
							payload: {
								authStatus: AuthStatus.AUTHENTICATED,
								credentials: { sessionToken, profile },
							},
						})
					} catch (err) {
						authDispatch({
							type: AuthActionTypes.UNAUTHENTICATE,
							payload: {
								authStatus: AuthStatus.UNAUTHENTICATED,
								credentials: null,
							},
						})
					}
				})()
			}
		} catch (err) {
			Toast(
				'Could not send OTP to your email. Please try again later.',
				'Something went wrong.',
				'error'
			)
		} finally {
			setIsSavingChanges(false)
		}
	}

	return (
		<>
			<Head>
				<title>Workspace</title>
			</Head>
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] min-h-screen'>
				<SidebarSettings />
				{isOtpBoxActive && (
					<Backdrop
						childInCenter={true}
						clickHandler={() => setIsOtpBoxActive(false)}
					>
						<div onClick={(e) => e.stopPropagation()}>
							<UpdateOtpModal
								closeBtnHandler={() => setIsOtpBoxActive(false)}
								email={emailInput}
								name={
									nameInputRef.current &&
									nameInputRef.current.value !==
										auth.credentials?.profile.name
										? nameInputRef.current.value
										: undefined
								}
								username={
									usernameInputRef.current &&
									usernameInputRef.current.value !==
										auth.credentials?.profile
											.workspace_username
										? usernameInputRef.current.value
										: undefined
								}
							/>
						</div>
					</Backdrop>
				)}
				<div className='md:ml-56 lg:w-[70%] sm:px-8 xs:px-6 xxs:px-4 px-2 font-Karla mt-20 md:mt-0 dark:bg-[#0A0F21] dark:text-textdark min-h-screen'>
					<div className='lg:p-16 sm:p-12 md:px-1 md:py-8 flex justify-between items-center py-10 xs:px-4 xxs:px-2 px-1'>
						<div className='flex items-center'>
							{auth.credentials?.profile?.profile_image ? (
								<div className='relative xl:w-44 xl:h-44 lg:w-36 lg:h-36 sm:w-32 sm:h-32 w-32 h-28 mr-1'>
									<Image
										layout='fill'
										className='rounded-full mr-1'
										src={
											auth.credentials.profile
												.profile_image
										}
										alt={
											auth.credentials.profile
												.profile_image
										}
									/>
								</div>
							) : (
								<Image
									className=' xl:w-44 xl:h-44 lg:w-36 lg:h-36 sm:w-32 sm:h-32 w-28 h-28 rounded-full mr-1'
									src={avatar}
									alt='avatar'
								/>
							)}

							<div className='xl:ml-7 sm:ml-5 flex flex-col ml-2'>
								<h1 className=' xl:text-[32px] sm:text-2xl font-bold text-xl'>
									{auth.credentials?.profile.name ||
										auth.credentials?.profile
											.twitter_username ||
										auth.credentials?.profile
											.pinterest_username ||
										auth.credentials?.profile
											.reddit_username}
								</h1>
								<p className='xl:text-[24px] sm:text-lg text-textgray dark:text-[#CECECE] font-normal text-sm'>
									@
									{
										auth.credentials?.profile
											.workspace_username
									}
								</p>
							</div>
						</div>
						<div className='flex gap-2'>
							{themeStorage === 'light' ? (
								<p className='md:text-base text-[#0A1334] font-medium text-sm hidden xs:block'>
									Light Mode
								</p>
							) : (
								<p className='md:text-base dark:text-textdark font-medium text-sm hidden xs:block'>
									Dark Mode
								</p>
							)}
							{themeStorage === 'light' ? (
								<div>
									<Switch
										sx={{
											'--switch-track-width': '38px',
											'--switch-track-height': '12px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
											'--chakra-colors-gray-300':
												'linear-gradient(159.64deg, #55ACEE 13.53%, #A1D4FB 88.25%)',
											// '--chakra-colors-chakra-border-color': '#707070',
										}}
										onChange={handleTheme}
										isChecked={!lightMode}
									/>
								</div>
							) : (
								<div>
									<Switch
										sx={{
											'--switch-track-width': '38px',
											'--switch-track-height': '12px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'linear-gradient(159.64deg, #001A75 13.53%, #001769 88.25%)',
											'--chakra-colors-gray-300':
												'linear-gradient(159.64deg, #001A75 13.53%, #001769 88.25%)',
											// '--chakra-colors-chakra-border-color': '#707070',
										}}
										onChange={handleTheme}
										isChecked={!lightMode}
									/>
								</div>
							)}
						</div>
					</div>
					<div className='lg:px-16 md:px-2 sm:px-12 flex flex-col xs:px-4 xxs:px-2 px-1'>
						<div className='flex items-center mb-8'>
							<label className=' sm:text-[24px] text-lg text-[#0A1334] dark:text-textdark font-normal sm:w-[25%] xs:w-[30%] w-[40%]'>
								Name
							</label>
							<input
								ref={nameInputRef}
								type='text'
								defaultValue={
									auth.credentials?.profile.name ||
									auth.credentials?.profile
										.twitter_username ||
									auth.credentials?.profile
										.pinterest_username ||
									auth.credentials?.profile.reddit_username
								}
								className='focus:outline-none xl:py-2 border-solid border-[0.4px] border-borderinput dark:border-borderdarkinput rounded-md bg-transparent w-full ml-2 px-3 sm:py-[5px] py-1 sm:text-lg text-base font-normal'
							/>
						</div>
						<div className='flex items-center mb-8'>
							<label className=' sm:text-[24px] text-lg text-[#0A1334] dark:text-textdark font-normal sm:w-[25%] xs:w-[30%] w-[40%]'>
								Username
							</label>
							<div className='flex  w-full  ml-2'>
								<span className=' xl:py-2 px-3 sm:py-[5px] py-1 sm:text-lg xs:text-base text-sm font-normal rounded-r-none border-r-0 border-solid border-[0.4px] border-borderinput dark:border-borderdarkinput rounded-md mr-0 pr-0 text-textgray dark:text-[#CECECE]'>
									tweepsbook.com/
								</span>
								<input
									ref={usernameInputRef}
									type='text'
									defaultValue={
										auth.credentials?.profile
											.workspace_username
									}
									className=' xl:py-2 border-l-0 pl-[2px] ml-0 rounded-l-none border-solid border-[0.4px] border-borderinput dark:border-borderdarkinput rounded-md bg-transparent w-full px-3 sm:py-[5px] py-1 sm:text-lg text-base font-normal focus:outline-none'
								/>
							</div>
						</div>
						<div className='flex items-center mb-10'>
							<label className=' sm:text-[24px] text-lg text-[#0A1334] dark:text-textdark font-normal sm:w-[25%] xs:w-[30%] w-[40%]'>
								Email
							</label>
							<div className='w-full ml-2 relative'>
								<input
									type='email'
									value={emailInput}
									onChange={(e) =>
										setEmailInput(e.target.value)
									}
									className='focus:outline-none w-full xl:py-2 border-solid border-[0.4px] border-borderinput dark:border-borderdarkinput rounded-md bg-transparent px-3 sm:py-[5px] py-1 sm:text-lg text-base font-normal'
								/>
								{emailInput !==
									auth.credentials?.profile.email && (
									<p className='opacity-80 text-sm font-bold absolute py-1 right-0'>
										A one time password would be sent to
										your email.
									</p>
								)}
							</div>
						</div>

						<button
							disabled={isSavingChanges}
							className='flex xl:w-[18%] px-2 py-3 bg-textprimary text-white dark:text-[#0A1334] dark:bg-[#F6F6F6] rounded-md sm:text-base text-sm font-medium self-end justify-center'
							onClick={handleSaveChanges}
						>
							{isSavingChanges ? <Spinner /> : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

const ProtectedWorkspace = withAuth(Workspace, undefined, true, '/')

const AnalyticsEnabledProtectedWorkspace =
	withPostHogAnalytics(ProtectedWorkspace)

export default AnalyticsEnabledProtectedWorkspace
