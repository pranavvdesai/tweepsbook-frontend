import { Tooltip } from '@chakra-ui/react'
import { ArchiveBox, NotePencil, TrashSimple } from 'phosphor-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { deleteBookmark as deleteBookmarkService, updateBookmark } from '@/apis'
import { useAuth } from '@/contexts'
import { useToast } from '@/hooks'

import { CustomLink } from '../custom_link/CustomLink'

const Icons = ({
	bookmarkId,
	isArchived,
}: {
	bookmarkId: string
	isArchived: boolean
}) => {
	const {
		auth: { credentials },
	} = useAuth()
	const queryClient = useQueryClient()
	const Toast = useToast()
	const [isHoverTrash, setIsHoverTrash] = useState(false)
	const [isHoverArchive, setIsHoverArchive] = useState(false)
	const [isHoverNote, setIsHoverNote] = useState(false)
	const { mutate: toggleArchiveBookmark } = useMutation(
		() => updateBookmark(bookmarkId, undefined, isArchived),
		{
			onSuccess: () => queryClient.invalidateQueries('bookmarks'),
			onError: () =>
				Toast(
					'Bookmark could not be archived right now. Please try again.',
					'Could not archive bookmark.',
					'error'
				),
		}
	)
	const { mutate: deleteBookmark } = useMutation(
		() => deleteBookmarkService(bookmarkId),
		{
			onSuccess: () => queryClient.invalidateQueries('bookmarks'),
			onError: () =>
				Toast(
					'Bookmark could not be deleted right now. Please try again.',
					'Could not delete bookmark.',
					'error'
				),
		}
	)

	const handleDeleteBookmark = () => {
		deleteBookmark()
	}

	return (
		<div className='flex items-center px-4 -z-0'>
			<div className='relative'>
				<CustomLink
					// target='_blank'
					href={`${
						credentials
							? credentials.profile.workspace_username
							: 'user'
					}/document/${bookmarkId}`}
				>
					<Tooltip label='Canvas' bg='#F5F5F5' color='#0A1334'>
						<NotePencil
							size={22}
							className='ml-3 cursor-pointer'
							weight={isHoverNote ? 'fill' : 'regular'}
							onMouseLeave={() => setIsHoverNote(false)}
							onMouseOver={() => setIsHoverNote(true)}
						/>
					</Tooltip>
				</CustomLink>
			</div>
			<div className='relative'>
				<Tooltip label='Archive' bg='#F5F5F5' color='#0A1334'>
					<ArchiveBox
						size={22}
						className='ml-3 cursor-pointer'
						weight={isHoverArchive ? 'fill' : 'regular'}
						onClick={() => toggleArchiveBookmark()}
						onMouseLeave={() => setIsHoverArchive(false)}
						onMouseOver={() => setIsHoverArchive(true)}
					/>
				</Tooltip>
			</div>
			<div className='relative'>
				<Tooltip label='Delete' bg='#F5F5F5' color='#0A1334'>
					<TrashSimple
						size={22}
						className='ml-3 cursor-pointer'
						weight={isHoverTrash ? 'fill' : 'regular'}
						color='#DD4C4C'
						onClick={handleDeleteBookmark}
						onMouseLeave={() => setIsHoverTrash(false)}
						onMouseOver={() => setIsHoverTrash(true)}
					/>
				</Tooltip>
			</div>
		</div>
	)
}

export default Icons
