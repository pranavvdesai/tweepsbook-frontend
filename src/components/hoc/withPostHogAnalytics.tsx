/* eslint-disable react/display-name */
import React, { useEffect, useRef } from 'react'

import { pageEntered, pageLeft } from '@/analytics'

export const withPostHogAnalytics =
	<P extends object>(Component: React.ComponentType<P>) =>
	(props: any) => {
		const entryTime = useRef(Date.now())
		useEffect(() => {
			pageEntered(document.title)
			return () => {
				const currentTimestamp = Date.now()
				const timeSpent = Math.floor(
					(currentTimestamp - entryTime.current) / 1000
				)
				pageLeft(timeSpent, document.title, window.pageYOffset)
			}
		}, [])

		return <Component {...props} />
	}
