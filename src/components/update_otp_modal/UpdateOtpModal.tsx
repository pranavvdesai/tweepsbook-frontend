import type { UseToastOptions } from '@chakra-ui/react'
import { PinInput, PinInputField, Spinner, useToast } from '@chakra-ui/react'
import { X as Close } from 'phosphor-react'
import { useState } from 'react'

import { readAccount, updateAccount, verifyOtp } from '@/apis'
import { useAuth } from '@/contexts'
import { AuthActionTypes, AuthStatus } from '@/types'

export const UpdateOtpModal = ({
	closeBtnHandler,
	email,
	name,
	username,
}: {
	closeBtnHandler: () => void
	email: string
	name?: string
	username?: string
}) => {
	const { auth, authDispatch } = useAuth()
	const [otp, setOtp] = useState<string>('')
	const [isUpdating, setIsUpdating] = useState<boolean>(false)

	const toast = useToast()

	const Toast = (
		description: string,
		title: string,
		status: UseToastOptions['status']
	) => {
		toast({
			title,
			description,
			status,
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

	const handleUpdateAccount = async () => {
		try {
			setIsUpdating(true)
			await verifyOtp(otp, email)
			await (async () => {
				try {
					await updateAccount(email, name, username)
					await (async () => {
						const sessionToken = auth.credentials?.sessionToken
						if (sessionToken === undefined) return
						try {
							const { data: profile } = await readAccount(
								sessionToken
							)
							authDispatch({
								type: AuthActionTypes.AUTHENTICATE,
								payload: {
									authStatus: AuthStatus.AUTHENTICATED,
									credentials: { sessionToken, profile },
								},
							})
						} catch (err) {
							authDispatch({
								type: AuthActionTypes.UNAUTHENTICATE,
								payload: {
									authStatus: AuthStatus.UNAUTHENTICATED,
									credentials: null,
								},
							})
						}
					})()
				} catch (err) {
					Toast(
						'Something went wrong.',
						'We could not update your account at moment. Please try again later.',
						'error'
					)
				}
			})()
			closeBtnHandler()
		} catch (err) {
			Toast(
				'The OTP you entered is invalid or has expired.',
				'Verification failed.',
				'error'
			)
		} finally {
			setIsUpdating(false)
		}
	}

	return (
		<div className='flex flex-col p-5 pt-12 gap-4 rounded-lg bg-white w-fit relative'>
			<button
				title='close'
				className='absolute right-4 top-4'
				onClick={closeBtnHandler}
			>
				<Close size={16} />
			</button>
			<p className='font-semibold'>
				Enter the OTP you received on your email
			</p>
			<div className='flex gap-3 items-center text-[#0A1334] font-bold justify-center'>
				<PinInput onChange={(e) => setOtp(e)}>
					<PinInputField />
					<PinInputField />
					<PinInputField />
					<PinInputField />
				</PinInput>
			</div>
			<button
				disabled={isUpdating || otp.length !== 4}
				className='btn-primary mt-3 mx-auto flex'
				onClick={handleUpdateAccount}
			>
				{isUpdating ? <Spinner /> : 'Update'}
			</button>
		</div>
	)
}
