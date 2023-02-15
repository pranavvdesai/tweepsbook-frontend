import { useLayoutEffect, useState } from 'react'

export const useMediaQuery = (mediaQuery: string) => {
	const checkQuery = (query: string) => {
		if (typeof window !== 'undefined') {
			return window.matchMedia(query).matches
		}
		return false
	}

	const [matches, setMatches] = useState<boolean>(checkQuery(mediaQuery))

	useLayoutEffect(() => {
		const matchMedia = window.matchMedia(mediaQuery)
		setMatches(checkQuery(mediaQuery))

		matchMedia.addEventListener('change', () => {
			setMatches(checkQuery(mediaQuery))
		})

		return () => {
			matchMedia.removeEventListener('change', () => {
				setMatches(checkQuery(mediaQuery))
			})
		}
	}, [mediaQuery])

	return matches
}
