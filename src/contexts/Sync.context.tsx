import type { Dispatch, SetStateAction } from 'react'
import { createContext, useState } from 'react'

interface ISyncContext {
	hasExpired: boolean
	setHasExpired: Dispatch<SetStateAction<boolean>>
}
const SyncContext = createContext<ISyncContext>({} as ISyncContext)

const SyncContextProvider = ({ children }: { children: JSX.Element }) => {
	const [hasExpired, setHasExpired] = useState(false)

	return (
		<SyncContext.Provider
			value={{
				hasExpired,
				setHasExpired,
			}}
		>
			{children}
		</SyncContext.Provider>
	)
}

export { SyncContext, SyncContextProvider }
