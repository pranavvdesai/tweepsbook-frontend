import { Spinner, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { X } from 'phosphor-react'
import { useMutation, useQueryClient } from 'react-query'

import { deleteCollection } from '@/apis'
import { useToast } from '@/hooks'

import { CustomLink } from '../custom_link/CustomLink'

const Collection = ({
	collection_name,
	_id,
}: {
	collection_name: string
	_id: string
}) => {
	const router = useRouter()
	const Toast = useToast()
	const queryClient = useQueryClient()
	const { mutate: handleDeleteCollection, isLoading: isDeletingCollection } =
		useMutation((collectionId: string) => deleteCollection(collectionId), {
			onSuccess: async () => {
				await queryClient.invalidateQueries('collections')
				await queryClient.invalidateQueries('bookmarks')
			},
			onError: () => {
				Toast(
					'Something went wrong.',
					'Could not delete collection. Please try again later.',
					'error'
				)
			},
		})
	return (
		<li
			key={_id}
			className={
				router.asPath === `/dashboard/?collection=${_id}`
					? 'group flex items-center rounded-lg bg-[#F2F2F2] dark:bg-[#0A0F21] pl-3'
					: 'group flex items-center rounded-lg hover:bg-[#F2F2F2] dark:hover:bg-[#0A0F21] pl-3'
			}
		>
			<CustomLink
				href={{
					pathname: '/dashboard',
					query: { collection: _id },
				}}
				className={`text-control mr-auto text-xl py-1 rounded-lg text-black dark:text-textdark w-full pr-1`}
			>
				#
				<span className='text-control max-w-[min(12ch,_85%)] pl-[2px]'>
					{collection_name}
				</span>
			</CustomLink>
			<Tooltip label='Delete Collection' bg='#F5F5F5' color='#0A1334'>
				<button
					disabled={isDeletingCollection}
					className=' py-1 pr-2 invisible group-hover:visible hover:visible'
					onClick={() => handleDeleteCollection(_id)}
				>
					{isDeletingCollection ? <Spinner /> : <X size={20} />}
				</button>
			</Tooltip>
		</li>
	)
}

export default Collection
