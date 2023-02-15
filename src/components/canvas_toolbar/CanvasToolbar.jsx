import {
	ArrowUpRight,
	Circle,
	Eraser,
	Pencil,
	Rectangle,
	Selection,
	Sticker,
	TextT,
	TrashSimple,
	Triangle,
} from 'phosphor-react'
import { useRef, useState } from 'react'

const colorOptions = [
	'blue',
	'white',
	'gray',
	'black',
	'cyan',
	'orange',
	'yellow',
	'green',
]

const shapeOptions = [
	{
		id: 1,
		type: 'triangle',
		Icon: Triangle,
		altText: 'Triangle',
	},
	{
		id: 2,
		type: 'rectangle',
		Icon: Rectangle,
		altText: 'Rectangle',
	},
	{
		id: 3,
		type: 'ellipse',
		Icon: Circle,
		altText: 'Ellipse',
	},
	{
		id: 4,
		type: 'line',
		Icon: Triangle,
		altText: 'Line',
	},
	{
		id: 5,
		type: 'arrow',
		Icon: ArrowUpRight,
		altText: 'Arrow',
	},
]

const normalIconWidth = 'thin'

const CanvasToolbar = ({ activeTool, tlDrawApp }) => {
	const [isShapeMenuActive, setIsShapeMenuActive] = useState(false)
	const [isColorMenuActive, setIsColorMenuActive] = useState(false)
	const [isDeleteBtnHoveredOver, setIsDeleteBtnHoveredOver] = useState(false)
	const [activeColor, setActiveColor] = useState(
		tlDrawApp ? tlDrawApp.appState.currentStyle.color : colorOptions[0]
	)
	const colorMenuRef = useRef(null)
	const shapeMenuRef = useRef(null)

	const closeAllMenus = () => {
		setIsColorMenuActive(false)
		setIsShapeMenuActive(false)
	}

	const toolButtonHandler = (type) => {
		if (tlDrawApp) {
			tlDrawApp.selectTool(type)
			// closeAllMenus(); doesn't work here, why?
		}
	}

	const deleteToolHandler = () => {
		if (tlDrawApp) {
			tlDrawApp.delete()
			closeAllMenus()
		}
	}

	const toggleShapeMenu = () => {
		setIsColorMenuActive(false)
		setIsShapeMenuActive((prev) => !prev)
	}

	const toggleColorMenu = () => {
		setIsShapeMenuActive(false)
		setIsColorMenuActive((prev) => !prev)
	}

	const colorButtonHandler = (color) => {
		if (tlDrawApp) {
			tlDrawApp.style({ color })
			setActiveColor(color)
		}
	}

	return (
		<div className='canvas-toolbar dark:bg-[#111834] dark:text-white'>
			<button
				title='Select'
				className='canvas-tool-item'
				onClick={() => toolButtonHandler('select')}
			>
				<Selection
					size={24}
					weight={
						activeTool === 'select' ? 'duotone' : normalIconWidth
					}
				/>
			</button>
			<button
				title='Text'
				className='canvas-tool-item'
				onClick={() => toolButtonHandler('text')}
			>
				<TextT
					size={24}
					weight={activeTool === 'text' ? 'duotone' : normalIconWidth}
				/>
			</button>
			<button
				className='canvas-tool-item'
				onClick={() => toolButtonHandler('draw')}
			>
				<Pencil
					size={24}
					alt='Pencil'
					weight={activeTool === 'draw' ? 'duotone' : normalIconWidth}
				/>
			</button>
			<button
				title='Eraser'
				className='canvas-tool-item'
				onClick={() => toolButtonHandler('erase')}
			>
				<Eraser
					size={24}
					weight={
						activeTool === 'erase' ? 'duotone' : normalIconWidth
					}
				/>
			</button>
			<div
				className='canvas-tool-item relative'
				onClick={toggleShapeMenu}
			>
				<button title='Shapes'>
					{(() => {
						const shape = shapeOptions.find(
							({ type }) => type === activeTool
						)
						if (shape) {
							const { Icon } = shape
							return <Icon size={24} weight='fill' />
						}
						return <Triangle size={24} weight={normalIconWidth} />
					})()}
				</button>
				{isShapeMenuActive && (
					<div
						ref={shapeMenuRef}
						className='canvas-toolbar absolute left-0 top-0 translate-x-canvas-sub-tb dark:bg-[#111834] dark:text-white'
					>
						{shapeOptions.map(({ id, type, Icon, altText }) => (
							<button
								key={id}
								title={altText}
								className='canvas-tool-item relative after:inset-0 after:absolute after:border after:border-transparent after:hover:bg-[#70707066]/40 hover:border-solid after:hover:border-[#70707066]/40 after:rounded after:pointer-events-none'
								onClick={() => toolButtonHandler(type)}
							>
								<Icon
									size={24}
									weight={
										activeTool === type
											? 'fill'
											: normalIconWidth
									}
								/>
							</button>
						))}
					</div>
				)}
			</div>
			<div
				className='canvas-tool-item relative'
				onClick={toggleColorMenu}
			>
				<button
					title='Colors'
					className='canvas-tool-item p-3 rounded'
					style={{ background: activeColor }}
				></button>
				{isColorMenuActive && (
					<div
						ref={colorMenuRef}
						className='canvas-toolbar translate-x-canvas-sub-tb absolute left-0 top-0 w-max grid grid-cols-2 p-1 gap-1 dark:bg-[#111834] dark:text-white'
					>
						{colorOptions.map((color) => (
							<button
								title={color}
								key={color}
								className='canvas-tool-item p-3 m-1 rounded relative after:absolute after:rounded after:border after:border-transparent after:inset-[-4px] hover:after:border-[#707070]/70'
								onClick={() => colorButtonHandler(color)}
								style={{ background: color }}
							></button>
						))}
					</div>
				)}
			</div>
			<button
				title='Sticky Note'
				className='canvas-tool-item'
				onClick={() => toolButtonHandler('sticky')}
			>
				<Sticker
					size={24}
					weight={
						activeTool === 'sticky' ? 'duotone' : normalIconWidth
					}
				/>
			</button>
			<button
				title='Delete'
				className='canvas-tool-item'
				onClick={deleteToolHandler}
				onMouseOver={() => setIsDeleteBtnHoveredOver(true)}
				onMouseOut={() => setIsDeleteBtnHoveredOver(false)}
			>
				<TrashSimple
					size={24}
					color='#DD4C4C'
					weight={isDeleteBtnHoveredOver ? 'fill' : normalIconWidth}
				/>
			</button>
		</div>
	)
}

export default CanvasToolbar
