import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { FC, HTMLProps } from 'react'

type ICustomLink = {
	onClick?: (e: MouseEvent) => void
} & LinkProps &
	HTMLProps<HTMLAnchorElement>

export const CustomLink: FC<ICustomLink> = ({
	as,
	children,
	href,
	onClick,
	replace,
	scroll,
	shallow,
	passHref,
	...rest
}) => (
	<Link
		as={as}
		href={href}
		passHref={passHref}
		replace={replace}
		scroll={scroll}
		shallow={shallow}
	>
		<a onClick={(e) => (onClick ? onClick(e) : null)} {...rest}>
			{children}
		</a>
	</Link>
)
