/* eslint-disable no-plusplus */
import type { UseToastOptions } from '@chakra-ui/react'
import { PinInput, PinInputField, Spinner, useToast } from '@chakra-ui/react'
import router from 'next/router'
import { useState } from 'react'

import { userDeleted } from '@/analytics'
import { deleteAccount, sendOtpToDeleteAccount, verifyOtp } from '@/apis'
import { useAuth } from '@/contexts'
import { AuthActionTypes, AuthStatus } from '@/types'
import { postLogoutActions } from '@/utils'

const OtpField = () => {
	const {
		authDispatch,
		auth: { credentials },
	} = useAuth()
	const [isOtpBoxActive, setIsOtpBoxActive] = useState<boolean>(false)
	const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false)
	const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)
	const [otpInput, setOtpInput] = useState<string>('')

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

	const handleSendOTP = async () => {
		const email = credentials?.profile.email
		if (email === undefined) return
		try {
			setIsSendingOtp(true)
			await sendOtpToDeleteAccount(email)
			Toast('We have sent an OTP to your email.', 'OTP sent.', 'success')
			setIsOtpBoxActive(true)
		} catch (err) {
			Toast(
				'Could not send OTP to your email. Please try again later.',
				'Failed to send OTP.',
				'error'
			)
		} finally {
			setIsSendingOtp(false)
		}
	}

	const handleDeleteAccount = async () => {
		const email = credentials?.profile.email
		if (email === undefined) return
		try {
			setIsDeletingAccount(true)
			await verifyOtp(otpInput, email)
			await (async () => {
				try {
					await deleteAccount()
				} catch (err) {
					Toast(
						'Something went wrong.',
						'We could not delete your account at moment. Please try again later.',
						'error'
					)
				}
			})()
			userDeleted()
			postLogoutActions(true)
			authDispatch({
				type: AuthActionTypes.UNAUTHENTICATE,
				payload: {
					authStatus: AuthStatus.UNAUTHENTICATED,
					credentials: null,
				},
			})
			router.push('/')
		} catch (err) {
			Toast(
				'The OTP you entered is invalid or has expired.',
				'Verification failed.',
				'error'
			)
		} finally {
			setIsDeletingAccount(false)
		}
	}

	return (
		<div className='font-[Karla]'>
			{isOtpBoxActive ? (
				<div>
					<div className='flex'>
						<PinInput onChange={(e) => setOtpInput(e)}>
							<PinInputField className='mr-2 text-[#0A1334] dark:text-white' />
							<PinInputField className='mr-2 text-[#0A1334] dark:text-white' />
							<PinInputField className='mr-2 text-[#0A1334] dark:text-white' />
							<PinInputField className='text-[#0A1334] dark:text-white' />
						</PinInput>
					</div>
					<div className='flex w-[13.5rem] mt-4 gap-3'>
						<button
							className='flex bg-[#309F6A] text-[#FFFFFF] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px]'
							onClick={() => setIsOtpBoxActive((prev) => !prev)}
						>
							Cancel
						</button>
						<button
							disabled={
								otpInput.length !== 4 || isDeletingAccount
							}
							className='flex bg-[#D45959] text-[#FFFFFF] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px]'
							onClick={handleDeleteAccount}
						>
							{isDeletingAccount ? <Spinner /> : 'Confirm'}
						</button>
					</div>
				</div>
			) : (
				<button
					disabled={isSendingOtp}
					className='flex bg-[#D45959] text-[#FFFFFF] py-1 px-2.5 border-[0.2px] border-[#70707066] rounded-[4px]'
					onClick={handleSendOTP}
				>
					{isSendingOtp ? <Spinner /> : 'Delete Account'}
				</button>
			)}
		</div>
	)
}

export default OtpField
