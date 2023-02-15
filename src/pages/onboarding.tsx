/* eslint-disable tailwindcss/no-custom-classname */
import type { UseToastOptions } from '@chakra-ui/react'
import {
	HStack,
	PinInput,
	PinInputField,
	Spinner,
	useToast,
} from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ArrowRight, PinterestLogo } from 'phosphor-react'
import { useState } from 'react'

import {
	checkEmailDisposability,
	sendOtpToUpdateEmail,
	verifyOtp,
} from '@/apis'
import { withAuth } from '@/components/hoc'
import { GoogleIcon } from '@/components/Icons/GoogleIcon'
import { RedditIcon } from '@/components/Icons/RedditIcon'
import { TwitterIcon } from '@/components/Icons/TwitterIcon'
import { getAuthLink } from '@/utils'

import img2a from '../../public/img2a.png'

const data = [
	{
		icon: <GoogleIcon width='42' height='42' />,
		title: 'Sign in with Google',
		client: 'google',
	},
	{
		icon: <TwitterIcon width='42' height='42' />,
		title: 'Sign in with Twitter',
		client: 'twitter',
	},
	{
		icon: <RedditIcon width='42' height='42' />,
		title: 'Sign in with Reddit',
		client: 'reddit',
	},
	{
		icon: (
			<PinterestLogo size={44} weight='fill' className='text-[#CB1F27]' />
		),
		title: 'Sign in with Pinterest',
		client: 'pinterest',
	},
]
const Onboarding = () => {
	const router = useRouter()
	const [isemail, setisemail] = useState(false)
	const [emailData, setemailData] = useState('')
	const [emailComponent, setemailComponent] = useState(true)
	const [isotpComponent, setisotpComponent] = useState(false)
	const [loginComponent, setloginComponent] = useState(false)
	const [otp, setOtp] = useState('')
	const [checkotp, setCheckotp] = useState(false)
	const [isLoading, setisLoading] = useState(false)

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
	const handleSubmitEmail = async (e: any) => {
		e.preventDefault()
		setisLoading(true)
		try {
			const {
				data: { disposable },
			} = await checkEmailDisposability(emailData)
			if (disposable === false) {
				Toast(
					'Cannot send OTP to this email. Please enter another email.',
					'Invalid email.',
					'error'
				)
				return
			}
			await sendOtpToUpdateEmail(emailData).then((res) => {
				if (res.status === 200) {
					setisLoading(false)
					Toast(
						'We have sent an OTP to your email.',
						'OTP sent.',
						'success'
					)
					setemailComponent(false)
					setisotpComponent(true)
				} else {
					setisLoading(false)
					Toast(
						'Cannot send OTP to this email. Please enter another email.',
						'Invalid email.',
						'error'
					)
					setisotpComponent(false)
				}
			})
		} catch (error) {
			setisLoading(false)
			Toast(
				'Cannot send OTP to this email. Please try again later.',
				'Invalid email.',
				'error'
			)
			setisotpComponent(false)
		}
	}

	const handleResendOtp = async () => {
		try {
			await sendOtpToUpdateEmail(emailData)
			Toast('We have sent an OTP to your email.', 'OTP sent.', 'success')
		} catch (error) {
			Toast(
				'Cannot send OTP to this email. Please try again later.',
				'Invalid email.',
				'error'
			)
		}
	}

	const handleSubmitOtp = async (value: any) => {
		try {
			await verifyOtp(value, emailData).then((res) => {
				if (res.data.validationStatus) {
					setCheckotp(true)
				} else {
					Toast('Invalid OTP.', 'Error', 'error')
				}
			})
		} catch (error) {
			Toast('Invalid OTP.', 'Error', 'error')
		}
	}
	const handleSignIn = (client: any) => {
		localStorage.setItem('email', emailData)
		router.push(getAuthLink(client))
	}
	const handleSignInpage1 = (client: any) => {
		router.push(getAuthLink(client))
	}

	return (
		<>
			<Head>
				<title>Onboarding</title>
			</Head>
			<div className='font-Karla bg-[#fbfbfb] xl:fixed w-full'>
				<div className='flex md:flex-row flex-col'>
					<div className='lg:w-[40%] md:w-[50%]'>
						<h1 className=' text-2xl px-9 pr-14 md:mt-16 mt-12 font-medium'>
							Hey! 👋 Welcome to{' '}
							<span className=' font-bold'>TweepsBook</span>, a
							personal space on the internet where you can{' '}
							<span className=' font-bold'>
								bookmark, read, sketch,
							</span>{' '}
							and
							<span className=' font-bold'> annotate</span> all
							your content.
						</h1>
						<div className='flex flex-col px-9 pr-14  mt-11'>
							{emailComponent && (
								<div className='lg:w-[78%] md:w-[85%] xl:w-[62%] flex flex-col'>
									<div
										className='flex items-center border-[0.2px] border-solid border-[#70707033] p-4 text-center rounded-[4px] cursor-pointer'
										onClick={() => {
											handleSignInpage1('google')
										}}
									>
										<GoogleIcon width='42' height='42' />
										<p className=' text-textprimary text-lg w-full font-medium cursor-pointer'>
											Sign in with Google
										</p>
									</div>
									<div className='h-5 border-b-2 border-[#707070] text-xl text-center my-10'>
										<span className='bg-white text-[#707070] px-5'>
											or
										</span>
									</div>
									<form
										className='flex flex-col'
										onSubmit={(e) => handleSubmitEmail(e)}
									>
										<input
											type='email'
											name='email'
											placeholder='Enter your email'
											className=' text-textgray placeholder:text-textgray text-xl bg-transparent border-b-2 mb-4 py-2 font-medium focus:outline-none px-1'
											onChange={(e) => {
												if (e.target.value) {
													setisemail(true)
												} else {
													setisemail(false)
												}
												setemailData(e.target.value)
											}}
										/>

										<button
											disabled={!isemail || isLoading}
											className={`${
												isemail
													? 'bg-textprimary'
													: ' bg-[#CECECE] disabled:cursor-not-allowed disabled:opacity-100'
											} text-white py-3 rounded-md text-lg`}
										>
											{isLoading ? (
												<Spinner className='mt-1' />
											) : (
												'Get OTP'
											)}
										</button>
									</form>
								</div>
							)}

							{isotpComponent && (
								<div className='md:w-[75%]'>
									<form className='flex flex-col'>
										{/* <OtpInput
									value={otp}
									onChange={setOtp}
									numInputs={4}
									inputStyle={{
										width: '100%',
										height: '4rem',
										margin: '1rem',
										fontSize: '2rem',
										borderRadius: 4,
										border: '2px solid rgba(0,0,0,0.3)',
									}}
									className=' block w-full text-xl font-normal text-gray-700 bg-clip-padding transition ease-in-out m-0 focus:text-gray-700  focus:border-orange-600 focus:outline-none'
								/> */}
										<HStack>
											<PinInput
												value={otp}
												onChange={(e) => setOtp(e)}
												onComplete={(value) =>
													handleSubmitOtp(value)
												}
												placeholder=' '
												type='number'
												focusBorderColor=' 0.2px solid #70707033'
											>
												<PinInputField
													borderColor='0.2px solid #70707033'
													backgroundColor='white'
													height='3rem'
													_hover={{
														borderColor:
															'0.2px solid #70707033',
													}}
												/>
												<PinInputField
													borderColor='0.2px solid #70707033'
													backgroundColor='white'
													height='3rem'
													_hover={{
														borderColor:
															'0.2px solid #70707033',
													}}
												/>
												<PinInputField
													borderColor='0.2px solid #70707033'
													backgroundColor='white'
													height='3rem'
													_hover={{
														borderColor:
															'0.2px solid #70707033',
													}}
												/>
												<PinInputField
													borderColor='0.2px solid #70707033'
													backgroundColor='white'
													height='3rem'
													_hover={{
														borderColor:
															'0.2px solid #70707033',
													}}
												/>
											</PinInput>
										</HStack>
										<p className=' text-lg font-medium py-4 text-textgray'>
											Didn't get OTP?{' '}
											<span
												className='text-[#CB1F27] cursor-pointer'
												onClick={handleResendOtp}
											>
												Resend OTP.
											</span>
										</p>
										<button
											disabled={!checkotp}
											className={`${
												checkotp
													? 'bg-textprimary'
													: ' bg-[#CECECE] disabled:cursor-not-allowed disabled:opacity-100'
											} text-white py-3 rounded-md text-lg flex text-center justify-center`}
											onClick={() => {
												setloginComponent(true)
												setisotpComponent(false)
											}}
										>
											Continue
											<ArrowRight
												size={26}
												className='ml-2'
											/>
										</button>
									</form>
								</div>
							)}
							{loginComponent && (
								<div className=' font-Karla flex flex-col lg:w-[80%] xl:w-[60%]'>
									{data.map((e, i) => {
										return (
											<div
												key={i}
												className='flex items-center border-[0.2px] border-solid border-[#70707033] p-4 text-center w-full rounded-[4px] cursor-pointer mb-4'
												onClick={() => {
													handleSignIn(e.client)
												}}
											>
												{e.icon}
												<p className=' text-textprimary text-lg font-medium w-full cursor-pointer'>
													{e.title}
												</p>
											</div>
										)
									})}
								</div>
							)}
						</div>
					</div>
					<div className=' bg-hero lg:w-[60%] md:w-[50%] md:flex md:flex-col hidden bg-[#f2f2f2]'>
						<div className=' my-10 text-center'>
							<h1 className=' font-Karla my-5 text-[48px] font-normal'>
								Bookmarks finally{' '}
								<span className=' font-extrabold underline underline-offset-8'>
									TAMED
								</span>
							</h1>
						</div>
						<div className='relative w-full h-full inline-block'>
							<div className='z-10 w-full h-full right-0'>
								<img
									src='/img1a.png'
									alt='bgdark'
									className='right-0 rounded-lg rounded-r-none'
								/>
							</div>
							<div className='absolute z-20 right-0 bottom-0 w-[85%]'>
								<Image
									src={img2a}
									alt='bgwhite'
									className='rounded-lg rounded-r-none'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default withAuth(Onboarding, false, undefined, '/dashboard')
