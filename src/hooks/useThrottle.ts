import { useCallback, useRef } from 'react'

export const useThrottle = (
	callback: (...args: any[]) => any,
	delayInMilliseconds: number
) => {
	const inWaitingPeriod = useRef<boolean>(false)
	const latestArgs = useRef<any[]>([])
	const timeoutFunc = useCallback(() => {
		if (latestArgs.current.length) {
			callback(...latestArgs.current)
			latestArgs.current = []
			setTimeout(timeoutFunc, delayInMilliseconds)
		} else {
			inWaitingPeriod.current = false
		}
	}, [])

	return (...args: any[]) => {
		if (inWaitingPeriod.current === false) {
			callback(...args)
			inWaitingPeriod.current = true
			setTimeout(timeoutFunc, delayInMilliseconds)
		} else {
			latestArgs.current = args
		}
	}
}
