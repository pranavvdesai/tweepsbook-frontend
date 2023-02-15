import { Skeleton, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { CheckCircle, PlusCircle } from 'phosphor-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { createCollection, readCollections } from '@/apis'
import { TwitterIcon } from '@/components/Icons/TwitterIcon'
import { useAuth } from '@/contexts'
import { useToast } from '@/hooks'
import { getAuthLink } from '@/utils'

import { CustomLink } from '../custom_link/CustomLink'
import Collection from './Collection'

const Tags = ({ height }: any) => {
	const router = useRouter()
	const {
		auth: { credentials },
	} = useAuth()
	const [isNewCollectionInputActive, setIsNewCollectionInputActive] =
		useState<boolean>(false)
	const [newCollectionInput, setNewCollectionInput] = useState<string>('')
	const {
		data: collections,
		isLoading,
		isError,
	} = useQuery('collections', readCollections, {
		retry: 3,
		refetchOnWindowFocus: false,
	})
	const Toast = useToast()
	const queryClient = useQueryClient()
	const { mutate: handleCreateCollection, isLoading: isCreatingCollection } =
		useMutation(
			(newCollectionName: string) => createCollection(newCollectionName),
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries('collections')
					await queryClient.invalidateQueries('bookmarks')
					setNewCollectionInput('')
					setIsNewCollectionInputActive(false)
				},
				onError: () => {
					Toast(
						'Something went wrong.',
						'Could not create collection. Please try again later.',
						'error'
					)
				},
			}
		)
	// sort collections.data.collection_name in ascending order
	collections?.data.sort((a: any, b: any) => {
		if (a.collection_name < b.collection_name) {
			return -1
		}
		if (a.collection_name > b.collection_name) {
			return 1
		}
		return 0
	})

	const handleSignIn = (client: string) => {
		router.push(getAuthLink(client, credentials?.profile?.profile_id))
	}
	if (isError)
		return (
			<div className='flex flex-col px-4 dark:bg-[#111834] dark:text-white'>
				<div className='py-2'>Error fetching collections</div>
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
		)

	return (
		<div className='flex flex-col pl-5 pr-3'>
			<h1 className='font-[700] text-xl mb-4 pl-3'>TAGS</h1>
			{isLoading ? (
				<div className='sidebar-collections-list-container'>
					{Array.from(Array(5)).map((_, i) => (
						<div key={i}>
							<Skeleton
								height='2.2rem'
								width='full'
								borderRadius='5px'
							/>
						</div>
					))}
				</div>
			) : (
				// eslint-disable-next-line tailwindcss/no-custom-classname
				<ul
					className={`sidebar-collections-list-container scrollbar dark:scrollbar-dark ${height}  overflow-y-scroll`}
				>
					<li
						className={
							router.asPath === '/dashboard/'
								? 'group flex items-center rounded-lg bg-[#F2F2F2] dark:bg-[#0A0F21] pl-3'
								: 'group flex items-center rounded-lg hover:bg-[#F2F2F2] dark:hover:bg-[#0A0F21] pl-3'
						}
					>
						<CustomLink
							href={{ pathname: '/dashboard', query: {} }}
							className={`text-control mr-auto text-xl py-1 rounded-lg text-black dark:text-textdark w-full pr-1`}
						>
							#
							<span className='text-control max-w-[min(12ch,_85%)] pl-[2px]'>
								all
							</span>
						</CustomLink>
					</li>
					{collections?.data.map(({ collection_name, _id }) => (
						<Collection
							key={_id}
							collection_name={collection_name}
							_id={_id}
						/>
					))}
					<div className='flex flex-col flex-wrap'>
						{isNewCollectionInputActive && (
							<div className='flex items-center border-b my-2 border-[#707070] dark:border-[#F5F5F5] pl-2'>
								<form
									className='flex w-[100%]'
									onSubmit={(e) => {
										e.preventDefault()
										handleCreateCollection(
											newCollectionInput
										)
									}}
								>
									<input
										value={newCollectionInput}
										type='text'
										className='focus:outline-none w-[100%] dark:bg-transparent'
										name='tagName'
										placeholder='Add a tag'
										onChange={(e) =>
											setNewCollectionInput(
												e.target.value
											)
										}
									/>
									<button
										type='submit'
										disabled={isCreatingCollection}
										title='create collection'
									>
										{isCreatingCollection ? (
											<Spinner />
										) : (
											<CheckCircle
												size={30}
												color='#707070'
												weight='fill'
											/>
										)}
									</button>
								</form>
							</div>
						)}
						<button className='mt-2 w-fit'>
							<PlusCircle
								size={30}
								className='text-[#707070] dark:text-[#F5F5F5]'
								weight='thin'
								onClick={() =>
									setIsNewCollectionInputActive(true)
								}
							/>
						</button>
					</div>
				</ul>
			)}
		</div>
	)
}

export default Tags
