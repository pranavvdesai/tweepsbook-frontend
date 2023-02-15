import type { Dispatch, SetStateAction } from 'react'
import React, { createContext, useState } from 'react'

import { TweepsbookSources } from '@/types'

interface IFilterContext {
	sourceSelect: {}
	setSourceSelect: Dispatch<SetStateAction<{}>>
	keyword: string
	setKeyword: Dispatch<SetStateAction<string>>
	author: string
	setAuthor: Dispatch<SetStateAction<string>>
	ascending: boolean
	setAscending: Dispatch<SetStateAction<boolean>>
}

const FilterContext = createContext<IFilterContext>({} as IFilterContext)

const FilterContextProvider = ({ children }: { children: JSX.Element }) => {
	const [sourceSelect, setSourceSelect] = useState(
		Object.values(TweepsbookSources).reduce(
			(acc, source) => ({ ...acc, [source]: false }),
			{}
		)
	)
	const [keyword, setKeyword] = useState<string>('')
	const [author, setAuthor] = useState<string>('')
	const [ascending, setAscending] = useState<boolean>(false)

	return (
		<FilterContext.Provider
			value={{
				sourceSelect,
				setSourceSelect,
				keyword,
				setKeyword,
				author,
				setAuthor,
				ascending,
				setAscending,
			}}
		>
			{children}
		</FilterContext.Provider>
	)
}

export { FilterContext, FilterContextProvider }
