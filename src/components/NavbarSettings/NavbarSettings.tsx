import { List } from 'phosphor-react'

const NavbarSettings = (props: any) => {
	return (
		<div className='w-full fixed top-0 font-Karla dark:bg-[#0A0F21]'>
			<List
				size={32}
				onClick={() => {
					props.setShowSidebar(
						props.showSidebar === '-left-56' ? 'left-0' : '-left-56'
					)
				}}
				className='md:hidden m-6 cursor-pointer dark:text-white'
			/>
		</div>
	)
}

export default NavbarSettings
