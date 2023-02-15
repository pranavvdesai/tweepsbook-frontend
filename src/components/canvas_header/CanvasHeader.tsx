import { Tooltip } from '@chakra-ui/react'
import Link from 'next/link'
import { ArrowLeft, ShareNetwork, Star } from 'phosphor-react'
import { useState } from 'react'

import { updateBookmark } from '@/apis'
import type { CanvasHeaderProps as Props } from '@/types'

// eslint-disable-next-line import/no-cycle
import { CustomLink, ShareMenu } from '..'

export const CanvasHeader = ({
	isAdmin,
	details,
	focus,
	bookmarkId,
	shareStatus,
}: Props) => {
	const [isShareMenuActive, setIsShareMenuActive] = useState<boolean>(false)
	const [star, setStar] = useState(details?.favorite_status)
	const handleStar = async () => {
		await updateBookmark(
			details.id,
			undefined,
			undefined,
			undefined,
			undefined,
			!star
		)
		setStar(!star)
	}
	return (
		<header className='flex justify-between dark:bg-[#111834] items-center py-3 pl-5 md:pl-20 md:pr-12 shadow-[0_4px_4px_0_rgba(150,150,150,0.04)] dark:shadow-none relative'>
			<div className='flex gap-2 items-center'>
				<Link href='/dashboard' passHref>
					<a>
						<div>
							<ArrowLeft
								size={28}
								weight='light'
								className='text-[#0A1334] dark:text-textdark mr-2'
							/>
						</div>
					</a>
				</Link>
				{details.hasAuthor ? (
					<>
						<span>{details.icon || null}</span>
						<span className='flex items-center gap-2 min-w-[250px]'>
							<span className='font-semibold md:text-[1.1rem] dark:text-white'>
								{details.primaryId
									? `by ${details.primaryId}`
									: null}
							</span>
							<span className='bullet'></span>
							<span className='text-[#707070] dark:text-[#CECECE]'>
								{details.secondaryId || null}
							</span>
						</span>
					</>
				) : (
					<span className='font-semibold text-lg dark:text-white'>
						{details.title || null}
					</span>
				)}
			</div>
			<div className='flex gap-6 items-center dark:text-white'>
				<span className='hidden'>{focus}%</span>
				{star ? (
					<Tooltip
						label='Added to Favourites'
						bg='#F5F5F5'
						color='#0A1334'
					>
						<Star
							size={26}
							weight='fill'
							className='cursor-pointer'
							onClick={handleStar}
						/>
					</Tooltip>
				) : (
					<Tooltip
						label='Add to Favourites'
						bg='#F5F5F5'
						color='#0A1334'
					>
						<Star
							size={26}
							weight='light'
							className='cursor-pointer'
							onClick={handleStar}
						/>
					</Tooltip>
				)}
				<CustomLink href={details.link} passHref>
					<button className='bg-[#CCD7FF]/30 text-[#0A1334] dark:text-white dark:bg-[#1A2759] rounded-[4px] border-[0.5px] border-current py-1 px-4'>
						View source
					</button>
				</CustomLink>
				<div className='relative'>
					<button
						className=' bg-[#CCD7FF]/30 text-[#0A1334] dark:text-white dark:bg-[#1A2759] rounded-[4px] border-[0.5px] border-current py-1 px-4 flex items-center gap-2 mr-5'
						onClick={() => setIsShareMenuActive(true)}
					>
						<ShareNetwork size={20} weight='fill' /> Share
					</button>
					{isShareMenuActive && (
						<div className='absolute right-5  top-[calc(100%_+_10px)] z-[3]'>
							<ShareMenu
								isAdmin={isAdmin}
								closeMenu={() => setIsShareMenuActive(false)}
								bookmarkId={bookmarkId}
								shareStatus={shareStatus}
							/>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}

/*
add body-x padding in tailwind.config
create a higher order component for header layout
remove scale from source logo container
position-relative for box-shadow? to-read
*/
// hello
