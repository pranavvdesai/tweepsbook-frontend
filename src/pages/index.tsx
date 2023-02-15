/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-console */
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { CustomLink } from '@/components'
import { useAuth } from '@/contexts'
import { useMediaQuery } from '@/hooks'
import { AuthStatus } from '@/types'

import Logo from '../../public/Logo  TweepsBook 1.jpg'
import ManCarryingCarton from '../../public/man-carton-box.png'
import Testimonial1 from '../../public/Testimonial11.png'
import Testimonial2 from '../../public/Testimonial12.png'
import Testimonial3 from '../../public/Testimonial13.png'
import Testimonial4 from '../../public/Testimonial14.png'
import Testimonial5 from '../../public/Testimonial21.png'
import Testimonial6 from '../../public/Testimonial22.png'
import Testimonial7 from '../../public/Testimonial23.png'
import Testimonial8 from '../../public/Testimonial31.png'
import Testimonial9 from '../../public/Testimonial32.png'
import Testimonial10 from '../../public/Testimonial33.png'

const Home = () => {
	const {
		auth: { authStatus },
	} = useAuth()
	const [showNavbar, setShowNavbar] = useState(false)
	const [featurePlayer, setFeaturePlayer] = useState(1)
	const [step1, setStep1] = useState(true)
	const [step2, setStep2] = useState(false)
	const [step3, setStep3] = useState(false)
	const notSupported = useMediaQuery('(max-width: 767px)')
	const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
	const getStartedRedirectionLink =
		authStatus === AuthStatus.AUTHENTICATED ? '/dashboard' : '/onboarding'

	useEffect(() => {
		const checkScroll = () => {
			const y = window.scrollY
			if (y >= 550) {
				setShowNavbar(true)
			} else {
				setShowNavbar(false)
			}
		}

		window.addEventListener('scroll', checkScroll)
	}, [])

	useEffect(() => {
		const setStep = () => {
			const s1 = document.getElementById('step1')
			const s2 = document.getElementById('step2')
			const s3 = document.getElementById('step3')

			if (!s1 || !s2 || !s3) return

			const pos1 = s1.getBoundingClientRect()
			const pos2 = s2.getBoundingClientRect()
			const pos3 = s3.getBoundingClientRect()
			if (pos1.top >= 0 && pos1.bottom <= window.innerHeight) {
				// console.log('Step1')
				setStep1(true)
				setStep2(false)
				setStep3(false)
			} else if (pos2.top >= 0 && pos2.bottom <= window.innerHeight) {
				// console.log('Step2')
				setStep1(false)
				setStep2(true)
				setStep3(false)
			} else if (pos3.top >= 0 && pos3.bottom <= window.innerHeight) {
				// console.log('Step3')
				setStep1(false)
				setStep2(false)
				setStep3(true)
			}
		}

		window.addEventListener('scroll', setStep)
	}, [])

	const working = [
		{
			heading: 'Authenticate your favourite platform',
			desc: 'Authorize your beloved platform. Ideally, the one where you have most of your bookmarks. We currently support Reddit, Twitter, and Pinterest, with more in the pipeline.',
		},
		{
			heading: 'Syncing all your bookmarked content',
			desc: 'Once you authorize a platform, we automatically sync all your bookmarks periodically. No need to press any buttons or mention public bots.',
		},
		{
			heading: 'Auto-classification of your bookmarks',
			desc: 'Once we have all your bookmarks, our AI will automatically categorize and classify all your bookmarks based on the text content in the thread.',
		},
	]

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<div className='font-[Karla]'>
				{notSupported ? (
					<div className='bg-hero bg-[#FBFBFB] m-auto h-[100%] w-[100%] p-2'>
						<Modal isOpen={isOpen} onClose={onClose}>
							<ModalOverlay />
							<ModalContent w='70%' p={3}>
								<ModalCloseButton />
								<ModalBody>
									<div className='relative m-auto w-[10em] h-[15em]'>
										<Image
											src='/underConstruction.svg'
											layout='fill'
											alt='Under Contruction'
										/>
									</div>
									<p className='text-[20px] font-[600] leading-[23px] text-center'>
										⚠This product works better on desktop as
										of now. We are working on the mobile
										version. We'll ship it soon.
									</p>
								</ModalBody>
							</ModalContent>
						</Modal>
						<div className='relative m-auto w-[70%] h-[350px]'>
							<Image
								src={ManCarryingCarton}
								layout='fill'
								alt='Young man carrying carton'
							/>
						</div>
						<div className='m-auto mt-[5%] w-[90%]'>
							<h1 className=' font-[400] text-[44px] leading-[51px] text-center text-[#0A1334]'>
								We <strong>COLLECT</strong> What You{' '}
								<strong>CLUTTER</strong>
							</h1>
							<p className='my-[5%] font-[Merriweather] text-[16px] text-[#949494] text-center tracking-[0.035em] leading-[24px]'>
								A tool that aggregates all your bookmarks and
								<strong> automatically categorizes</strong> them
								into different collections.
							</p>
							<div className='flex justify-center'>
								<CustomLink href={getStartedRedirectionLink}>
									<button className='bg-[#0A1334] w-full text-[#FFFFFF] text-[20px] py-1 px-6 border-[0.2px] border-[#70707066] rounded-[4px]'>
										Get Started
									</button>
								</CustomLink>
							</div>
						</div>
					</div>
				) : (
					<div>
						{/* Hero Section */}
						<div className='bg-hero bg-[#FBFBFB] m-auto xl:pb-[220px] lg:pb-[120px] md:pb-[80px]'>
							<h1 className='lg absolute font-[700] text-[#0A1334] xl:text-[18px] lg:text-[16px] md:text-[14px] pt-2 pl-6'>
								BETA
							</h1>
							<div className='absolute 2xl:w-[410px] xl:w-[395px] lg:w-[310px] md:w-[270px] 2xl:left-[-50px] lg:top-0 md:top-[50px] xl:left-[-100px] lg:left-[-50px] md:left-[-90px] 2xl:h-[460px] xl:h-[445px] lg:h-[380px] md:h-[250px] ml-[110px] mt-[42px] mr-[-50px]'>
								<Image
									src={ManCarryingCarton}
									layout='fill'
									alt='Young man carrying carton'
								/>
							</div>
							<div>
								<div className='flex justify-center'>
									<div
										className={`${
											showNavbar
												? 'ease-in-out duration-[500ms] flex lg:gap-9 md:gap-4 justify-center z-10 text-[#707070] font-[400] items-center m-auto my-8 lg:w-[730px] md:w-[550px] lg:h-[70px] md:h-[50px] bg-[#FFFFFF] border-[0.1px] border-[#70707022] rounded-[4px] shadow-[0_4px_5px_rgba(206,206,206,0.1)]'
												: 'ease-in-out scale-y-0 top-[-100vh]'
										} fixed`}
									>
										<div className='relative lg:h-[55px] lg:w-[55px] md:h-[45px] md:w-[55px]'>
											<Image
												src={Logo}
												layout='fill'
												alt='Tweepbook logo'
											/>
										</div>
										<a
											href='https://wiki.tweepsbook.com/blogs'
											target='_blank'
											rel='noreferrer'
										>
											<p className='lg:text-[24px] md:text-[20px]'>
												Blogs
											</p>
										</a>
										<a
											href='https://wiki.tweepsbook.com/'
											target='_blank'
											rel='noreferrer'
										>
											<p className='lg:text-[24px] md:text-[20px]'>
												Knowledge Base
											</p>
										</a>
										<a href='mailto:hello@slipbox.it?subject=Support'>
											<p className='lg:text-[24px] md:text-[20px]'>
												Support
											</p>
										</a>
										<CustomLink
											href={getStartedRedirectionLink}
										>
											<button className='bg-[#0A1334] lg:w-full md:w-[100px] text-[#FFFFFF] lg:text-[22px] md:text-[12px] py-1 lg:px-6 md:px-2 border-[0.2px] border-[#70707066] rounded-[4px]'>
												Get Started
											</button>
										</CustomLink>
									</div>
								</div>
								<div className='2xl:w-[650px] xl:w-[600px] lg:w-[400px] md:w-[275px] m-auto mt-[124px]'>
									{/* <h1 className='2xl:text-[77px] xl:text-[72px] lg:text-[48px] md:text-[32px] font-[400] xl:leading-[94px] lg:leading-[55px] md:leading-[40px] text-center text-[#0A1334]'>
										We <strong>COLLECT</strong> What You{' '}
										<strong>CLUTTER</strong>
									</h1> */}
									<div className='relative 2xl:w-[650px] 2xl:h-[160px] xl:w-[600px] xl:h-[140px] lg:w-[400px] lg:h-[120px] md:w-[285px] md:h-[100px]'>
										<Image
											src='/heroHeading.svg'
											layout='fill'
											alt='working'
										/>
									</div>
									<p className='xl:my-9 lg:my-7 md:my-4 font-[Merriweather] 2xl:text-[26px] xl:text-[24px] lg:text-[16px] md:text-[11px] text-[#949494] text-center tracking-[0.045em] xl:leading-[37px] lg:leading-[25px]'>
										A tool that aggregates all your
										bookmarks and
										<strong>
											{' '}
											automatically categorizes
										</strong>{' '}
										them into different collections.
									</p>
									<div className='flex justify-center'>
										<CustomLink
											href={getStartedRedirectionLink}
										>
											<button className='bg-[#0A1334] lg:w-full md:w-[100px] text-[#FFFFFF] lg:text-[22px] md:text-[12px] py-1 lg:px-6 md:px-2 border-[0.2px] border-[#70707066] rounded-[4px]'>
												Get Started
											</button>
										</CustomLink>
									</div>
								</div>
							</div>
							<div className='m-auto xl:w-[950px] lg:w-[800px] md:w-[600px] lg:mt-[120px] md:mt-[80px] lg:h-[450px] md:h-[380px]'>
								<video autoPlay loop controls muted>
									<source
										src='/tweepsbook.mp4'
										type='video/mp4'
									/>
								</video>
							</div>
						</div>
						{/* Features section */}
						<div className='bg-[#0A1334] py-8 2xl:px-16 xl:px-[50px] lg:px-[32px] md:px-[28px]'>
							<h1 className='ellipse text-[#FFFFFF] xl:text-[40px] lg:text-[30px] md:text-[22px] text-center before:border-[#FFFFFF]/20 xl:before:w-[160px] lg:before:w-[130px] md:before:w-[100px] lg:before:translate-y-[40%] md:before:translate-y-[10%]'>
								Features
							</h1>
							<div className='flex justify-center 2xl:gap-[unset] xl:gap-6 lg:gap-5 md:gap-4 mb-10'>
								<div className='w-[530px] mt-10 m-auto'>
									<div
										className={`${
											featurePlayer === 1 &&
											'bg-[#142666] opacity-80'
										} flex gap-3 mb-[20px] hover:bg-[#142666] hover:opacity-80 p-5 rounded-[4px]`}
										onClick={() => setFeaturePlayer(1)}
									>
										<h2 className='text-[#FFFFFF] xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
											01
										</h2>
										<div>
											<h2 className='text-[#FFFFFF] lg:mb-3 md:mb-1 xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
												Multiple Content Platforms
											</h2>
											<p className='text-[#CECECE] xl:text-[24px] lg:text-[20px] md:text-[18px] font-[400] lg:leading-[27px] md:leading-[22px]  tracking-widest'>
												Just a click away from
												integrating platforms like
												Twitter, Reddit, or Pinterest.
											</p>
										</div>
									</div>
									<div
										className={`${
											featurePlayer === 2 &&
											'bg-[#142666] opacity-80'
										} flex gap-2 mb-[20px] hover:bg-[#142666] hover:opacity-80 p-5 rounded-[4px]`}
										onClick={() => setFeaturePlayer(2)}
									>
										<h2 className='text-[#FFFFFF] xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
											02
										</h2>
										<div>
											<h2 className='text-[#FFFFFF] lg:mb-3 md:mb-1 xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
												Seamless Sync & Auto
												Classification
											</h2>
											<p className='text-[#CECECE] xl:text-[24px] lg:text-[20px] md:text-[18px] font-[400] lg:leading-[27px] md:leading-[22px]  tracking-widest'>
												Automate your bookmarks & let
												the AI handle all the work.
											</p>
										</div>
									</div>
									<div
										className={`${
											featurePlayer === 3 &&
											'bg-[#142666] opacity-80'
										} flex gap-2 mb-[20px] hover:bg-[#142666] hover:opacity-80 p-5 rounded-[4px]`}
										onClick={() => setFeaturePlayer(3)}
									>
										<h2 className='text-[#FFFFFF] xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
											03
										</h2>
										<div>
											<h2 className='text-[#FFFFFF] lg:mb-3 md:mb-1 xl:text-[32px] lg:text-[28px] md:text-[23px] lg:leading-[37px] md:leading-[30px] tracking-[-0.01em]'>
												Read Content & Sketch Notes
											</h2>
											<p className='text-[#CECECE] xl:text-[24px] lg:text-[20px] md:text-[18px] font-[400] lg:leading-[27px] md:leading-[22px]  tracking-widest'>
												Take a moment to doodle your
												thoughts while reading your
												favorite threads.
											</p>
										</div>
									</div>
								</div>
								<div className='m-auto'>
									{featurePlayer === 1 && (
										<video width='800' autoPlay loop>
											<source
												src='/Platforms.mp4'
												type='video/mp4'
											/>
										</video>
									)}
									{featurePlayer === 2 && (
										<video width='800' autoPlay loop>
											<source
												src='/AutoTagSync.mp4'
												type='video/mp4'
											/>
										</video>
									)}
									{featurePlayer === 3 && (
										<video width='800' autoPlay loop>
											<source
												src='/Canvas.mp4'
												type='video/mp4'
											/>
										</video>
									)}
								</div>
							</div>
						</div>
						{/* How it Works and testimonals */}
						<div className='bg-hero bg-[#FBFBFB] lg:pt-[190px] md:pt-[120px] pb-20'>
							<h1 className='ellipse mb-16 text-[#0A1334] lg:text-[32px] md:text-[22px] text-center lg:before:w-[185px] md:before:w-[140px] before:border-[#0A1334]/20 lg:before:translate-y-[40%]'>
								How it Works
							</h1>
							<div className='flex justify-between relative lg:mb-10 md:mb-5 2xl:mx-[7%] xl:mx-[5%] lg:mx-[5%] md:mx-[6%]'>
								<div className='2xl:w-[565px] xl:w-[500px] lg:w-[400px] md:w-[300px]'>
									{working.map((e, i) => (
										<div
											key={i}
											id={`step${i + 1}`}
											className='mb-[10rem]'
										>
											<h2 className='text-[#0A1334] xl:text-[48px] lg:text-[42px] md:text-[30px] font-[700] xl:leading-[56px] lg:leading-[52px] md:leading-[40px] tracking-[-0.01em] xl:mb-[24px] lg:mb-[20px] md:mb-[16px]'>
												{e.heading}
											</h2>
											<p className='text-[#707070] xl:text-[28px] lg:text-[24px] md:text-[20px] xl:leading-[45px] lg:leading-[35px] md:leading-[25px] tracking-[-0.01em]'>
												{e.desc}
											</p>
										</div>
									))}
								</div>
								<div className='relative mb-[140px] 2xl:w-[664px] xl:w-[630px] lg:w-[500px] md:w-[360px] '>
									{step1 && (
										<div className='sticky 2xl:w-[664px] 2xl:h-[340px] xl:w-[630px] xl:h-[300px] lg:w-[500px] lg:h-[260px] md:w-[360px] md:h-[220px] mx-auto top-[200px] rounded-[4px]'>
											<Image
												src='/working1.svg'
												layout='fill'
												alt='working'
											/>
										</div>
									)}
									{step2 && (
										<div className='sticky xl:w-[555px] lg:w-[450px] xl:h-[513px] lg:h-[460px] md:w-[320px] md:h-[350px] top-[150px] rounded-[4px] mx-auto'>
											<Image
												src='/working2.svg'
												layout='fill'
												alt='working'
											/>
										</div>
									)}
									{step3 && (
										<div className='sticky xl:w-[555px] xl:h-[405px] lg:w-[450px] lg:h-[365px] md:w-[360px] md:h-[220px] top-[200px] rounded-[4px] mx-auto'>
											<Image
												src='/working3.svg'
												layout='fill'
												alt='working'
											/>
										</div>
									)}
								</div>
							</div>
							<h1 className='ellipse text-[#0A1334] lg:text-[32px] md:text-[22px] text-center mb-16 lg:before:w-[185px] md:before:w-[140px] before:border-[#0A1334]/20 lg:before:translate-y-[40%]'>
								Testimonials
							</h1>
							<div className='flex 2xl:px-[8rem] xl:px-[3rem] lg:px-[2rem] md:px-[2rem] py-10'>
								<div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial1} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial2} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial3} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial4} alt='' />
									</div>
								</div>
								<div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] my-[20px]'>
										<Image src={Testimonial5} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] my-[20px]'>
										<Image src={Testimonial6} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] my-[20px]'>
										<Image src={Testimonial7} alt='' />
									</div>
								</div>
								<div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial8} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial9} alt='' />
									</div>
									<div className='shadow-3xl border-[#70707011] border-[0.2px] rounded-[8px] m-[20px]'>
										<Image src={Testimonial10} alt='' />
									</div>
								</div>
							</div>
						</div>
						{/* Footer */}
						<div className='bg-[#0A1334] text-[#FFFFFF] flex py-[32px] lg:px-[64px] md:px-[20px] '>
							<div className='lg:w-[50%] md:w-[40%]'>
								<h1 className='font-[Merriweather] font-bold lg:text-[40px] md:text-[30px] '>
									Slipbox
								</h1>
							</div>
							<div className='flex lg:w-[50%] md:w-[60%] justify-evenly lg:gap-[64px] md:gap-[20px]'>
								<div>
									<h2 className='lg:text-[34px] md:text-[24px] mb-[20px] leading-[37px]'>
										Support
									</h2>
									<a
										href='mailto:hello@slipbox.it?subject=Support'
										target='_blank'
										rel='noreferrer'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Email
										</p>
									</a>
									<a
										href='https://twitter.com/messages/1350865466340741120-1523739509858639872?recipient_id=1350865466340741120&text='
										target='_blank'
										rel='noreferrer'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Twitter
										</p>
									</a>
								</div>
								<div>
									<h2 className='lg:text-[34px] md:text-[24px] mb-[20px] leading-[37px]'>
										About
									</h2>
									<a
										href='/about/privacy-policy'
										target='_blank'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Privacy Policy
										</p>
									</a>
									<a
										href='/about/terms-of-service'
										target='_blank'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Terms of Service
										</p>
									</a>
								</div>
								<div>
									<h2 className='lg:text-[34px] md:text-[24px] mb-[20px] leading-[37px]'>
										Follow us on
									</h2>
									<a
										href='https://twitter.com/tweepsbookcom'
										target='_blank'
										rel='noreferrer'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Twitter
										</p>
									</a>
									<a
										href='https://www.linkedin.com/company/slipboxit/about/'
										target='_blank'
										rel='noreferrer'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											LinkedIn
										</p>
									</a>
									<a
										href='https://www.reddit.com/r/slipboxit/'
										target='_blank'
										rel='noreferrer'
									>
										<p className='lg:text-[24px] md:text-[16px] mb-[12px] leading-[28px]'>
											Reddit
										</p>
									</a>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default Home
