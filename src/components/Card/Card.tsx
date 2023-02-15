import { Avatar } from '@chakra-ui/react'
import Image from 'next/image'
import { PinterestLogo } from 'phosphor-react'
import { useState } from 'react'

import { useAuth } from '@/contexts'
import type { CardProps } from '@/types'
import { TweepsbookSources } from '@/types'

import { CustomLink } from '../custom_link/CustomLink'
import { RedditIcon } from '../Icons'
import ArticleIcon from '../Icons/ArticleIcon'
import { TwitterIcon } from '../Icons/TwitterIcon'
import TagCard from '../TagCard/TagCard'
import Icons from './Icons'

const Card = ({
	archiveStatus,
	bookmarkId,
	tags,
	imageSrc,
	lastCardRef,
	primaryId,
	secondaryId,
	source,
	text,
	time,
	userAvatarSrc,
}: CardProps) => {
	const [icons, setIcons] = useState(false)
	const handleIcons = () => {
		setIcons(true)
	}
	const handleIconsExit = () => {
		setIcons(false)
	}
	const {
		auth: { credentials },
	} = useAuth()

	const dateObj = new Date(time)
	const month = dateObj.toLocaleString('default', { month: 'short' })
	const dat = dateObj.getDate()
	const year = dateObj.getFullYear()
	const dateStr = `${month} ${dat}, ${year}`
	const timeStr = dateObj.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	})

	const getBorderColor = (tweepsSource: TweepsbookSources) => {
		if (tweepsSource === TweepsbookSources.PINTEREST) {
			return 'dark:border-pinterest-red'
		}
		if (tweepsSource === TweepsbookSources.REDDIT) {
			return 'dark:border-[#FF8F6699]'
		}
		if (tweepsSource === TweepsbookSources.TWITTER) {
			return 'dark:border-[#80C8FF99]'
		}
		return 'dark:border-custom'
	}
	const getBorderColorDark = (tweepsSource: TweepsbookSources) => {
		if (tweepsSource === TweepsbookSources.PINTEREST) {
			return 'border-pinterest-red'
		}
		if (tweepsSource === TweepsbookSources.REDDIT) {
			return 'border-reddit-orange'
		}
		if (tweepsSource === TweepsbookSources.TWITTER) {
			return 'border-twitter-blue'
		}
		return 'border-custom'
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
		<div
			className='font-Karla dark:text-textdark'
			onMouseEnter={handleIcons}
			onMouseLeave={handleIconsExit}
			ref={lastCardRef}
		>
			<div
				className={`lg:max-w-sm shadow-3xl dark:shadow-none bg-white dark:bg-[#111834] border-[0.4px] rounded-[4px] ${getBorderColor(
					source
				)} ${getBorderColorDark(source)}`}
			>
				<div className='flex justify-between items-center'>
					{getIcon(source) ? (
						<div className='p-4'>{getIcon(source)}</div>
					) : (
						<div className='p-6'></div>
					)}

					{icons && (
						<Icons
							isArchived={archiveStatus}
							bookmarkId={bookmarkId}
						/>
					)}
				</div>
				<CustomLink
					href={`${
						credentials
							? credentials.profile.workspace_username
							: 'user'
					}/document/${bookmarkId}`}
				>
					<div className='dark:border-y-[1px] border-y-2 dark:border-[#707070] hover:cursor-pointer'>
						{(source === TweepsbookSources.TWITTER ||
							source === TweepsbookSources.REDDIT) && (
							<div className='flex space-x-1 items-center pt-3 px-4'>
								{userAvatarSrc ? (
									<div className='relative shrink-0 w-10 h-10 rounded-full mr-1 overflow-hidden'>
										<Image
											alt={userAvatarSrc}
											layout='fill'
											src={userAvatarSrc}
										/>
									</div>
								) : (
									<Avatar size='sm' className='mr-1' />
								)}
								{primaryId && (
									<h1 className='m-1 font-medium text-base overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer'>
										{primaryId}
									</h1>
								)}
								{secondaryId && (
									<>
										<span className='bullet' />
										<p className='text-[#707070] dark:text-[#CECECE] text-sm pl-1 overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer'>
											{secondaryId}
										</p>
									</>
								)}
							</div>
						)}
						<div className='px-4 py-[14px] '>
							{text && text?.length === 0 && imageSrc && (
								<p className='text-[black] dark:text-textdark py-2 leading-5 font-normal text-base hover:cursor-pointer'>
									{text}
								</p>
							)}
							{text && text?.length > 1 && imageSrc && (
								<p className='text-[black] dark:text-textdark py-2 leading-5 font-normal text-base hover:cursor-pointer'>
									{text}
								</p>
							)}
							{text && !imageSrc && (
								<p className='text-[black] dark:text-textdark leading-5 font-normal text-base hover:cursor-pointer'>
									{text}
								</p>
							)}
							{imageSrc && (
								<div className='relative rounded-lg my-3 w-full h-full aspect-square overflow-hidden'>
									<Image
										layout='fill'
										objectFit='cover'
										src={imageSrc}
										alt={imageSrc}
									/>
								</div>
							)}
						</div>
					</div>
				</CustomLink>
				<div className='px-4 py-3'>
					<div className='flex space-x-1 text-sm text-[#707070] dark:text-[#CECECE] items-center font-normal'>
						<p>{timeStr}</p>
						<span className='bullet' />
						<p>{dateStr}</p>
					</div>
				</div>
				<TagCard bookmarkId={bookmarkId} bookmarkTags={tags} />
			</div>
		</div>
	)
}

export default Card
