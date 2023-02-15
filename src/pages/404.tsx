/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'

import { CustomLink } from '@/components'

import errguy from '../../public/errguy.png'

const Custom404 = () => {
	useEffect(() => {
		if (localStorage.getItem('theme')) {
			document.body.classList.add(
				localStorage.getItem('theme') || 'light'
			)
		}
	}, [])
	return (
		<>
			<Head>
				<title>404</title>
			</Head>
			<div className='bg-hero bg-[#FBFBFB] dark:bg-[#0A0F21] font-Karla'>
				<div className='container mx-auto '>
					<div className='flex items-center justify-center min-h-screen'>
						<div className='relative flex flex-col '>
							{/* <div className='absolute w-80 h-80 lg:left-[5%] lg:top-[29%] xl:left-[12%] xl:top-[30%] 2xl:left-[20%]'> */}
							<div className='absolute lg:w-80 lg:h-80 md:w-72 md:h-72 lg:-left-[55%] lg:-top-[10%] md:-left-[67%] md:-top-[20%]'>
								<Image
									src={errguy}
									alt='404 guy'
									layout='responsive'
								/>
							</div>
							<div className='font-medium text-center text-[#0A1334] dark:text-white h-fit '>
								<div className='lg:leading-[270px] 2xl:text-[300px] lg:text-[270px] md:text-[200px] md:leading-[180px] xxs:text-[150px] xxs:leading-[150px] text-[120px] leading-[140px] '>
									404
								</div>
							</div>
							<p className='md:text-4xl text-3xl text-center text-[#0A1334] dark:text-white mt-1 mb-3 font-light'>
								Page not found
							</p>
							<CustomLink
								href='/'
								className='md:w-[40%] xxs:w-[60%] self-center items-center  px-4 py-2 mt-4 text-sm font-semibold text-white dark:text-[#0A1334] uppercase transition duration-200 ease-in bg-[#0A1334] dark:bg-[#FFFFFF] rounded focus:outline-none text-center'
							>
								Back to home
							</CustomLink>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Custom404
