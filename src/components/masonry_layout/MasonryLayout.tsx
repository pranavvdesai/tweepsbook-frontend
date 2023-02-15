export const MasonryLayout = ({
	columnContents,
	gap,
}: {
	columnContents: Array<Array<JSX.Element | null>>
	gap: string
}) => {
	return (
		<div
			style={{
				gridTemplateColumns: `repeat(${columnContents.length}, 1fr)`,
				gap,
			}}
			className='w-full grid'
		>
			{columnContents.map((column, colIndex) => (
				<div key={colIndex} style={{ gap }} className='flex flex-col'>
					{column.map((Item) => Item)}
				</div>
			))}
		</div>
	)
}
