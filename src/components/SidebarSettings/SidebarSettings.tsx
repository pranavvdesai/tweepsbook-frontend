import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'phosphor-react'
import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import NavbarSettings from '../NavbarSettings/NavbarSettings'

const Sidebar = () => {
	const [showSidebar, setShowSidebar] = useState('-left-56')
	const router = useRouter()
	return (
		<>
			<OutsideClickHandler
				onOutsideClick={() => {
					setShowSidebar('-left-56')
				}}
			>
				<NavbarSettings
					showSidebar={showSidebar}
					setShowSidebar={setShowSidebar}
				/>
				<div
					className={`h-[100%] fixed top-0 bg-white font-Karla ${showSidebar} md:left-0 overflow-y-auto flex-row flex-nowrap overflow-hidden w-56 z-10 border-solid border-[0.5px] dark:text-textdark border-bordersidebarsettings transition-all duration-300 dark:border-borderdarkcard dark:bg-[#111834]`}
				>
					<div className='flex-col items-stretch flex-nowrap px-0 relative w-full'>
						<div className='flex gap-[10%] mt-1 py-6 px-1 mb-8 items-center border-b-[0.4px] border-[#70707033]'>
							<Link href='/dashboard' passHref>
								<a>
									<div>
										<ArrowLeft
											size={28}
											weight='light'
											className='text-[#0A1334] dark:text-textdark ml-3'
										/>
									</div>
								</a>
							</Link>
							<h1 className=' font-[Karla] text-xl font-bold'>
								Settings
							</h1>
						</div>
						<ul className='flex-col min-w-full flex list-none mt-8 px-6'>
							<li className='rounded-lg mb-2 hover:bg-[#F2F2F2] items-center font-Karla'>
								<Link href='/settings/workspace'>
									<a
										className={
											router.pathname ===
											'/settings/workspace'
												? 'flex items-center gap-4 text-lg text-[#0A1334] dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21] dark:bg-[#0A0F21] bg-sidebargray'
												: 'flex items-center gap-4 text-lg text-black dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21]'
										}
									>
										Workspace
									</a>
								</Link>
							</li>
							<li className='rounded-lg mb-2'>
								<Link href='/settings/connections'>
									<a
										className={
											router.pathname ===
											'/settings/connections'
												? 'flex items-center gap-4 text-lg text-[#0A1334] dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21] dark:bg-[#0A0F21] bg-sidebargray'
												: 'flex items-center gap-4 text-lg text-black dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21]'
										}
									>
										Connections
									</a>
								</Link>
							</li>
							<li className='rounded-lg mb-2'>
								<Link href='/settings/privacy'>
									<a
										className={
											router.pathname ===
											'/settings/privacy'
												? 'flex items-center gap-4 text-lg text-[#0A1334] dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21] dark:bg-[#0A0F21] bg-sidebargray'
												: 'flex items-center gap-4 text-lg text-black dark:text-textdark px-4 py-3 rounded-md font-medium hover:bg-sidebargray dark:hover:bg-[#0A0F21]'
										}
									>
										Privacy
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</OutsideClickHandler>
		</>
	)
}

export default Sidebar
