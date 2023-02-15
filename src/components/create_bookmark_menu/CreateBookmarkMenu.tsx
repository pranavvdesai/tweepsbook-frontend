import { Spinner } from '@chakra-ui/react'
import { X as Close } from 'phosphor-react'
import type { MutableRefObject } from 'react'
import { useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { createBookmark } from '@/apis'
import { useToast } from '@/hooks'

export const CreateBookmarkMenu = ({
	addPopoverRef,
	closeClickHandler,
}: {
	addPopoverRef: MutableRefObject<HTMLDivElement | null>
	closeClickHandler: () => void
}) => {
	const Toast = useToast()
	const queryClient = useQueryClient()
	const { mutate: handleCreateBookmark, isLoading: isCreatingBookmark } =
		useMutation((bookmarkLink: string) => createBookmark(bookmarkLink), {
			onSuccess: async () => {
				await queryClient.invalidateQueries('bookmarks')
				closeClickHandler()
			},
			onError: () =>
				Toast(
					'Could not create bookmark. Try again later.',
					'Something went wrong.',
					'error'
				),
		})
	const bookmarkInputRef = useRef<HTMLInputElement | null>(null)

	return (
		<div
			className='shadow-lg dark:shadow-none top-[calc(100%+7px)] bg-[#FFFFFF] dark:bg-[#0A0F21] dark:border-[#70707099] dark:text-[#FBFBFB] rounded-[4px] border-[0.2px] border-[#70707033] mr-3 w-[330px] text-left absolute right-[5px] text-[#0A1334] p-[12px]'
			ref={addPopoverRef}
		>
			<div className='flex justify-between mb-3'>
				<h1 className='text-[16px] text-[#0A1334] dark:text-[#FBFBFB]'>
					Paste any Link
				</h1>
				<Close
					size={16}
					weight='bold'
					onClick={closeClickHandler}
					className='cursor-pointer dark:text-[#FBFBFB]'
				/>
			</div>
			<input
				type='url'
				ref={bookmarkInputRef}
				className='focus:outline-none w-[303px] h-[30px] border-[0.2px] rounded-[2px] border-[#70707033] p-2 dark:bg-transparent dark:border-[#70707099] dark:text-[#FBFBFB]'
			/>
			<button
				disabled={isCreatingBookmark}
				className='w-[305px] text-[#FFFFFF] text-[14px] bg-[#0A1334] dark:bg-[#FBFBFB] dark:text-[#0A1334] rounded-[2px] border-[0.2px] border-[#70707033] mt-4 px-2 py-1'
				onClick={() => {
					if (bookmarkInputRef.current?.value.length) {
						handleCreateBookmark(bookmarkInputRef.current.value)
					}
				}}
			>
				{isCreatingBookmark ? <Spinner /> : 'Bookmark'}
			</button>
		</div>
	)
}
