/* eslint-disable no-console */
/* eslint-disable tailwindcss/no-custom-classname */
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Tooltip,
} from '@chakra-ui/react'
import { CaretDown, CaretRight, X } from 'phosphor-react'
import { useMutation } from 'react-query'

import { readFavourites, updateBookmark } from '@/apis'
import { useAuth } from '@/contexts'
import { useToast } from '@/hooks'

import { CustomLink } from '../custom_link/CustomLink'

const Favourites = ({ dataFav }: any) => {
	const Toast = useToast()
	const {
		auth: { credentials },
	} = useAuth()
	const { mutate: handleDeleteFavorite, isLoading: isDeletingFavorite } =
		useMutation(
			(bookmarkId: string) =>
				updateBookmark(
					bookmarkId,
					undefined,
					undefined,
					undefined,
					undefined,
					false
				),
			{
				onSuccess: () => readFavourites(),
				onError: () => {
					Toast(
						'Something went wrong.',
						'Could not delete collection. Please try again later.',
						'error'
					)
				},
			}
		)
	return (
		<Accordion allowMultiple mb={4}>
			<AccordionItem className='pl-5 pr-3' border='none'>
				{({ isExpanded }) => (
					<>
						<div className='flex items-center justify-between'>
							<h2 className='font-[700] text-xl w-full'>
								<AccordionButton
									p='unset'
									fontSize='unset'
									_hover={{ bg: 'unset' }}
									className='text-2xl flex justify-between hover:bg-[#ffffff] '
								>
									<span className='pl-3'>FAVOURITES</span>
									{isExpanded ? (
										<CaretDown size={20} weight='bold' />
									) : (
										<CaretRight size={20} weight='bold' />
									)}
								</AccordionButton>
							</h2>
						</div>
						<AccordionPanel pb={4} px='unset'>
							<div
								className={`scrollbar dark:scrollbar-dark pt-2 overflow-y-scroll ${
									dataFav.length >= 3 ? `h-[100px]` : `h-auto`
								} `}
							>
								{dataFav.map(({ _id, post_heading }: any) => {
									return (
										<div
											key={_id}
											className=' flex rounded-lg hover:bg-[#F2F2F2] dark:hover:bg-[#0A0F21] hover:cursor-pointer mr-2'
										>
											<CustomLink
												href={`/${credentials?.profile.workspace_username}/document/${_id}`}
												className={`text-control py-2 pl-3 font-medium text-xl`}
											>
												{post_heading}
											</CustomLink>
											<Tooltip
												label='Delete Collection'
												bg='#F5F5F5'
												color='#0A1334'
											>
												<button
													disabled={
														isDeletingFavorite
													}
													className='opacity-0 hover:opacity-100 py-1 pr-2 '
													onClick={() =>
														handleDeleteFavorite(
															_id
														)
													}
												>
													<X size={20} />
												</button>
											</Tooltip>
										</div>
									)
								})}
							</div>
						</AccordionPanel>
					</>
				)}
			</AccordionItem>
		</Accordion>
	)
}

export default Favourites
