import { Switch } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { withAuth, withPostHogAnalytics } from '@/components/hoc'
import SidebarSettings from '@/components/SidebarSettings/SidebarSettings'

import DeleteAccount from '../../components/DeleteAccount/DeleteAccount'

const Privacy = () => {
	const [themeStorage, setThemeStorage] = useState<string>(
		localStorage.getItem('theme') || 'light'
	)
	useEffect(() => {
		if (localStorage.getItem('theme')) {
			setThemeStorage(localStorage.getItem('theme') || 'light')
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
		}
	}, [])
	return (
		<>
			<Head>
				<title>Privacy</title>
			</Head>

			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] min-h-screen'>
				<SidebarSettings />
				<div className='px-8 py-10 md:ml-56 font-[Karla]'>
					<div className='mt-[25px] mx-9 text-[#0A1334] dark:text-white'>
						<h1 className='text-[24px] border-b-[0.2px] pb-1 mb-[30px] border-b-[#CECECE] dark:border-b-[#70707033]'>
							COOKIE SETTINGS
						</h1>
						<div className='flex gap-10 mb-[30px]'>
							<div className='w-[170px]'>
								<h2 className='text-[18px] pb-1'>
									Strictly necessary
								</h2>
								<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70'>
									Essential for the site to function. Always
									On.
								</p>
							</div>
							<div className='flex justify-center items-center'>
								{themeStorage === 'light' ? (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
										}}
										isChecked
									/>
								) : (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-white': '#0A1334',
											'--chakra-colors-blue-500':
												'#FFFFFF',
										}}
										isChecked
									/>
								)}
							</div>
						</div>
						<div className='flex gap-10 mb-[30px]'>
							<div className='w-[170px]'>
								<h2 className='text-[18px] pb-1'>Functional</h2>
								<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70'>
									Used to remember preference selections and
									provide enhanced features.
								</p>
							</div>
							<div className='flex justify-center items-center'>
								{themeStorage === 'light' ? (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
										}}
										isChecked
									/>
								) : (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-white': '#0A1334',
											'--chakra-colors-blue-500':
												'#FFFFFF',
										}}
										isChecked
									/>
								)}
							</div>
						</div>
						<div className='flex gap-10 mb-[30px]'>
							<div className='w-[170px]'>
								<h2 className='text-[18px] pb-1'>Analytics</h2>
								<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70'>
									Used to measure usage and improve your
									experience.
								</p>
							</div>
							<div className='flex justify-center items-center'>
								{themeStorage === 'light' ? (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
										}}
										isChecked
									/>
								) : (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-white': '#0A1334',
											'--chakra-colors-blue-500':
												'#FFFFFF',
										}}
										isChecked
									/>
								)}
							</div>
						</div>
						<div className='flex gap-10 mb-[42px]'>
							<div className='w-[170px]'>
								<h2 className='text-[18px] pb-1'>Marketing</h2>
								<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70'>
									Used for targeted advertising.
								</p>
							</div>
							<div className='flex justify-center items-center'>
								{themeStorage === 'light' ? (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
										}}
										isChecked
									/>
								) : (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-white': '#0A1334',
											'--chakra-colors-blue-500':
												'#FFFFFF',
										}}
										isChecked
									/>
								)}
							</div>
						</div>
						<h1 className='text-[24px] border-b-[0.2px] pb-1 mb-[30px] border-b-[#CECECE] dark:border-b-[#70707033]'>
							WORKSPACE SETTINGS
						</h1>
						{/* <div className='flex gap-10 mb-[42px]'>
							<div className='w-[170px]'>
								<h2 className='text-[18px] pb-1'>
									Allow Workspace Access
								</h2>
								<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70'>
									Essential for the site to function. Always
									On.
								</p>
							</div>
							<div className='flex justify-center items-center'>
								{themeStorage === 'light' ? (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-blue-500':
												'#0A1334',
										}}
										isChecked
									/>
								) : (
									<Switch
										sx={{
											'--switch-track-width': '44px',
											'--switch-track-height': '17px',
											'--chakra-space-0-5': '3.5px',
											'--chakra-colors-white': '#0A1334',
											'--chakra-colors-blue-500':
												'#FFFFFF',
										}}
										isChecked
									/>
								)}
							</div>
						</div> */}
						<h1 className='text-[24px] border-b-[0.2px] pb-1 mb-[30px] border-b-[#CECECE] dark:border-b-[#70707033]'>
							DELETE ACCOUNT
						</h1>
						<DeleteAccount />
						<p className='text-[#707070] dark:text-[#CECECE] text-[14px] font-[400] opacity-70 mt-2'>
							This will permanently delete your account.
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

const ProtectedPrivacy = withAuth(Privacy, undefined, true, '/')

const AnalyticsEnabledProtectedPrivacy = withPostHogAnalytics(ProtectedPrivacy)

export default AnalyticsEnabledProtectedPrivacy
