import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

export const useIntersectionObserver = (
	elementRef: RefObject<Element>,
	{ threshold = 1, root = null, rootMargin = '0%' }: IntersectionObserverInit,
	reTriggerDependency: any[] = []
) => {
	const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(
		undefined
	)

	useEffect(() => {
		const element = elementRef.current

		const freeze = element === null

		if (freeze) return

		const observer = new IntersectionObserver(
			([latestEntry]) => setEntry(latestEntry),
			{ threshold, root, rootMargin }
		)

		observer.observe(element)

		// eslint-disable-next-line consistent-return
		return () => observer.disconnect()
	}, [
		elementRef,
		JSON.stringify(threshold),
		root,
		rootMargin,
		JSON.stringify(reTriggerDependency),
	])

	return entry
}

// re triggering, anti pattern?
