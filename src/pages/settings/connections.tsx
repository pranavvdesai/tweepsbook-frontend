import Head from 'next/head'
import { PinterestLogo } from 'phosphor-react'
import { useEffect } from 'react'

import { CustomLink } from '@/components'
import { withAuth, withPostHogAnalytics } from '@/components/hoc'
import SidebarSettings from '@/components/SidebarSettings/SidebarSettings'
import { useAuth } from '@/contexts'
import { getAuthLink } from '@/utils'

import { RedditIcon } from '../../components/Icons/RedditIcon'
import { TwitterIcon } from '../../components/Icons/TwitterIcon'

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
		connected: false,
		client: 'pinterest',
	},
]

const Connections = () => {
	const {
		auth: { credentials },
	} = useAuth()
	if (credentials?.profile?.twitter_auth_tokens) {
		data[0]!.connected = true
		data[0]!.handle = `@${credentials?.profile?.twitter_username}`
	}
	if (credentials?.profile?.reddit_auth_tokens) {
		data[1]!.connected = true
		data[1]!.handle = `${credentials?.profile?.reddit_username}`
	}

	if (credentials?.profile?.pinterest_auth_tokens) {
		data[2]!.connected = true
		data[2]!.handle = `@${credentials?.profile?.pinterest_username}`
	}
	useEffect(() => {
		if (localStorage.getItem('theme')) {
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
		}
	}, [])
	return (
		<>
			<Head>
				<title>Connections</title>
			</Head>
			<div className='bg-[#fbfbfb] dark:bg-[#0A0F21] min-h-screen'>
				<SidebarSettings />
				<div className='px-8 py-10 md:ml-56'>
					<div className='flex flex-wrap gap-9 mt-[45px]'>
						{data.map((e, i) => {
							return (
								<div
									className='flex justify-between px-4 py-3 gap-3 bg-[#FFFFFF] dark:bg-[#111834] dark:text-textdark border-[#CECECE] border-[0.4px] dark:border-borderconnectiondark rounded-[8px] w-[365px]'
									key={i}
								>
									<div className='flex justify-center items-center gap-4'>
										<div>{e.icon}</div>
										<div>
											<h1 className='text-[#0A1334] dark:text-textdark text-xl font-[600] '>
												{e.title}
											</h1>
											{e.connected && (
												<p className='text-[#707070] dark:text-[#CECECE80] text-[15px] font-[400] '>
													{e.handle}
												</p>
											)}
										</div>
									</div>
									<div className='flex justify-center items-center'>
										{!e.connected ? (
											<CustomLink
												href={getAuthLink(
													e.client,
													credentials?.profile
														.profile_id
												)}
												className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px]'
											>
												Connect
											</CustomLink>
										) : (
											<CustomLink
												href={getAuthLink(
													e.client,
													credentials?.profile
														.profile_id
												)}
												className='bg-[#309F6A] dark:bg-[#309F6A] text-[#FFFFFF] dark:text-[#111834] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px]'
											>
												Reauthorize
											</CustomLink>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

const ProtectedConnections = withAuth(Connections, undefined, true, '/')

const AnalyticsEnabledProtectedConnections =
	withPostHogAnalytics(ProtectedConnections)

export default AnalyticsEnabledProtectedConnections
