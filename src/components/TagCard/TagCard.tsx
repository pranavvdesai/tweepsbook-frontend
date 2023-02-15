import { createPopper } from '@popperjs/core'
import type { AxiosResponse } from 'axios'
import { PlusCircle, X as Close } from 'phosphor-react'
import { createRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useMutation, useQueryClient } from 'react-query'

import { updateBookmarkCollection } from '@/apis'
import { useToast } from '@/hooks'
import type { Bookmark, Collection } from '@/types'
import { CollectionState } from '@/types'

const TagCard = ({
	bookmarkId,
	bookmarkTags,
}: {
	bookmarkId: Bookmark['_id']
	bookmarkTags: Bookmark['collections']
}) => {
	const [popperinstance, setPopperInstance] = useState<any>(null)
	const [disabled, setDisabled] = useState(false)
	const [isNewCollectionInputActive, setIsNewCollectionInputActive] =
		useState<boolean>(false)
	const inputRef = createRef<any>()
	const inputPopoverRef = createRef<any>()
	const Toast = useToast()
	const [newCollectionName, setNewCollectionName] = useState<string>('')
	const queryClient = useQueryClient()
	const collectionsData = queryClient.getQueryData('collections') as
		| AxiosResponse<Collection[]>
		| undefined

	const remainingCollections = collectionsData?.data.filter(
		(collection) =>
			!bookmarkTags.some(
				(bookmarkTag) =>
					bookmarkTag.collection_name === collection.collection_name
			)
	)

	const { mutate: handleRemoveTag, isLoading: isRemovingTag } = useMutation(
		(collectionName: string) =>
			updateBookmarkCollection(
				CollectionState.POP,
				bookmarkId,
				collectionName
			),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries('collections')
				await queryClient.invalidateQueries('bookmarks')
			},
			onError: () =>
				Toast(
					'Tag could not be removed right now. Please try again.',
					'Could not remove tag.',
					'error'
				),
		}
	)
	const { mutate: handleAddTag } = useMutation(
		(collectionName: string) =>
			updateBookmarkCollection(
				CollectionState.PUSH,
				bookmarkId,
				collectionName
			),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries('collections')
				setDisabled(false)
				if (popperinstance) popperinstance.destroy()
				setIsNewCollectionInputActive(false)
				setNewCollectionName('')
				await queryClient.invalidateQueries('bookmarks')
			},
			onError: () =>
				Toast(
					'Tag could not be added right now. Please try again.',
					'Could not add tag.',
					'error'
				),
		}
	)
	const { mutate: handleAddTagChecked } = useMutation(
		(collectionName: string) =>
			updateBookmarkCollection(
				CollectionState.PUSH,
				bookmarkId,
				collectionName
			),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries('collections')
				await queryClient.invalidateQueries('bookmarks')
			},
			onError: () =>
				Toast(
					'Tag could not be added right now. Please try again.',
					'Could not add tag.',
					'error'
				),
		}
	)

	const tagfromChecked = (
		e: React.ChangeEvent<HTMLInputElement>,
		collectionName: string
	) => {
		if (e.target.checked) {
			handleAddTagChecked(collectionName)
		} else if (!e.target.checked) {
			handleRemoveTag(collectionName)
		}
	}

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		collectionName: string
	) => {
		e.preventDefault()
		if (!collectionName.replaceAll(' ', '').length) return
		handleAddTag(collectionName)
	}

	const handleNewCollectionInputActive = () => {
		setIsNewCollectionInputActive(true)
		setDisabled(true)
		const instance = createPopper(
			inputRef.current as Element,
			inputPopoverRef.current as HTMLElement,
			{
				placement: 'bottom',
			}
		)
		setPopperInstance(instance)
	}
	return (
		<div className='flex flex-wrap items-center px-4 pb-2'>
			{bookmarkTags.map(({ _id, collection_name }) => (
				<div key={_id} className='mx-1 mb-1'>
					<div className='flex items-center border border-[#707070] dark:border-[#F5F5F5] text-sm font-normal px-2 py-1 rounded-md mb-1'>
						<span className='text-[#707070] dark:text-textdark mr-1.5'>
							#{collection_name}
						</span>
						<button
							disabled={isRemovingTag}
							onClick={() => handleRemoveTag(collection_name)}
						>
							<Close size={16} />
						</button>
					</div>
				</div>
			))}
			{isNewCollectionInputActive && (
				<OutsideClickHandler
					onOutsideClick={() => {
						setDisabled(false)
						if (popperinstance) popperinstance.destroy()
						setIsNewCollectionInputActive(false)
					}}
				>
					<div className='relative'>
						<div className='flex mx-1 mb-1'>
							<form
								onSubmit={(e) => {
									handleSubmit(e, newCollectionName)
								}}
							>
								<input
									name='tagName'
									type='text'
									value={newCollectionName}
									placeholder='Add a tag'
									className='border border-[#707070] dark:bg-transparent px-2 p-1 mr-2 mb-1 rounded-md text-sm '
									onChange={(e) =>
										setNewCollectionName(e.target.value)
									}
								/>
							</form>
						</div>
						<div
							className={`top-[calc(100%+1px)] mx-1 bg-[#FBFBFB] ${
								remainingCollections!?.length > 4
									? `scrollbar dark:scrollbar-dark h-[100px]`
									: `h-auto`
							} dark:bg-[#111834] rounded-[6px] overflow-y-auto border-solid border-[0.4px] border-[#70707033] dark:border-[#70707099] mr-3 w-36 text-left absolute right-0 text-[#0A1334] p-[12px] z-10`}
							ref={inputPopoverRef}
						>
							<div className='flex flex-col text-[#9A9A9A] font-medium'>
								{remainingCollections &&
									(remainingCollections.length === 0 ? (
										<div className='text-[#9A9A9A] font-medium'>
											No tags found
										</div>
									) : (
										remainingCollections.map(
											({ _id, collection_name }) => {
												// if (
												// 	bookmarkTags.find(
												// 		(tag) =>
												// 			tag.collection_name ===
												// 			collection_name
												// 	)
												// ) {
												// 	return (
												// 		<div
												// 			className='flex flex-row-reverse justify-between'
												// 			key={_id}
												// 		>
												// 			<input
												// 				type='checkbox'
												// 				className='peer accent-[#0A1334] border-[#CECECE] dark:accent-textdark cursor-pointer'
												// 				onChange={(e) =>
												// 					tagfromChecked(
												// 						e,
												// 						collection_name
												// 					)
												// 				}
												// 				checked
												// 			/>
												// 			<label className=' peer-checked:text-black dark:peer-checked:text-textdark overflow-hidden whitespace-nowrap text-ellipsis pr-1'>
												// 				#
												// 				{
												// 					collection_name
												// 				}
												// 			</label>
												// 		</div>
												// 	)
												// }
												return (
													<div
														className='flex flex-row-reverse justify-between'
														key={_id}
													>
														<input
															type='checkbox'
															className='peer accent-[#0A1334] border-[#CECECE] dark:accent-textdark cursor-pointer'
															onChange={(e) =>
																tagfromChecked(
																	e,
																	collection_name
																)
															}
														/>
														<label className=' peer-checked:text-black dark:peer-checked:text-textdark overflow-hidden whitespace-nowrap text-ellipsis pr-1'>
															#{collection_name}
														</label>
													</div>
												)
											}
										)
									))}
							</div>
						</div>
					</div>
				</OutsideClickHandler>
			)}
			<button
				disabled={disabled}
				className='hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:cursor-not-allowed mb-2'
				onClick={handleNewCollectionInputActive}
			>
				<PlusCircle
					size={32}
					// color='#707070'
					className='text-[#707070] dark:text-textdark'
					weight='thin'
					ref={inputRef}
				/>
			</button>
		</div>
	)
}

export default TagCard
