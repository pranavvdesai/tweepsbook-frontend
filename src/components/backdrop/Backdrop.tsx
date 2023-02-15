export const Backdrop = ({
	background,
	children,
	childInCenter,
	clickHandler,
}: {
	background?: string
	children: JSX.Element
	childInCenter?: boolean
	clickHandler?: (e: React.MouseEvent<HTMLDivElement>) => void
}) => {
	return (
		<div
			onClick={(e) => (clickHandler ? clickHandler(e) : null)}
			className={`bg-black/75 fixed inset-0 z-50 ${
				childInCenter ? 'grid place-items-center' : null
			}`}
			style={{ backgroundColor: background || undefined }}
		>
			{children}
		</div>
	)
}
