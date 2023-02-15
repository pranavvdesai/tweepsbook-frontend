import { Switch } from '@chakra-ui/react'
import { LinkedinLogo, LinkSimple, X as Close } from 'phosphor-react'
import { useState } from 'react'

import { updateBookmark } from '@/apis'
import type { ShareMenuProps as Props } from '@/types'

import { CustomLink } from '../custom_link/CustomLink'

export const twitterSvg = (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='6 4 36 36'
		width='24px'
		height='24px'
	>
		<path
			fill='#03A9F4'
			d='M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429'
		/>
	</svg>
)

const shareMessage = 'Hey, checkout this bookmark at Tweepsbook!'

export const ShareMenu = ({
	isAdmin,
	bookmarkId,
	closeMenu,
	shareStatus: initialShareStatus,
}: Props) => {
	const [shareStatus, setShareStatus] = useState<boolean>(initialShareStatus)

	const handleShareOnWeb = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newStatus = e.target.checked
		try {
			setShareStatus(newStatus)
			await updateBookmark(bookmarkId, newStatus)
		} catch (err) {
			setShareStatus(!newStatus)
		}
	}

	return (
		<div className='bg-white dark:bg-[#111834] dark:text-white px-3 text-sm w-[402px] rounded-[4px] shadow-[0_4px_4px_rgba(199,199,199,0.08)] dark:shadow-none border-[0.2px] border-[#70707099]'>
			<button className='block ml-auto pt-3' onClick={closeMenu}>
				<Close size={16} className=' dark:text-white' />
			</button>
			<div className='flex gap-4'>
				<button
					className='share-icon-btn'
					onClick={() =>
						navigator.clipboard.writeText(window.location.href)
					}
				>
					{<LinkSimple size={24} />}
				</button>
				<CustomLink
					className='share-icon-btn'
					href={`https://twitter.com/share?url=${window.location.href}&text=${shareMessage}`}
					target='_blank'
				>
					{twitterSvg}
				</CustomLink>
				<CustomLink
					className='p-[10px] rounded-full aspect-square border-solid border border-[#707070]/60'
					href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(
						window.location.href
					)}&title=${shareMessage}&summary=${'Tweepsbook'}`}
					target='_blank'
				>
					{
						<LinkedinLogo
							size={30}
							weight='fill'
							className='text-[#0A66C2]'
						/>
					}
				</CustomLink>
			</div>
			<div className='mt-[20px] mb-[15px] flex gap-2'>
				<Switch
					disabled={!isAdmin}
					mt='3px'
					sx={{
						'--switch-track-width': '40px',
						'--switch-track-height': '15px',
						'--chakra-space-0-5': '3.5px',
						// '--chakra-colors-gray-300': '#F6F6F6',
						// '--chakra-colors-chakra-border-color': '#707070',
					}}
					isChecked={shareStatus}
					onChange={handleShareOnWeb}
				/>
				{isAdmin && (
					<label className='text-[16px] text-[#707070] dark:text-[#CECECE]'>
						Share it to web
					</label>
				)}
			</div>
		</div>
	)
}
