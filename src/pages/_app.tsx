import '../styles/global.css'
import '../styles/markdown.css'

import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { buttonClicked, initPostHog, linkClicked } from '@/analytics'
import { AuthProvider } from '@/contexts/Auth.context'

import { FilterContextProvider } from '../contexts/filter.context'

const MyApp = ({ Component, pageProps }: AppProps) => {
	const queryClient = new QueryClient()

	useEffect(() => {
		initPostHog({ autocapture: false })
		document.body.addEventListener('click', (e) => {
			e.stopPropagation()
			const { target } = e
			if (target instanceof Element) {
				if (
					target.matches('a, button') &&
					target.hasAttribute('data-ph-role')
				) {
					const role = target.getAttribute('data-ph-role') as string
					if (target.matches('button')) {
						buttonClicked(role)
					} else {
						linkClicked(role)
					}
				}
			}
		})
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider>
				<AuthProvider>
					<FilterContextProvider>
						<>
							<Component {...pageProps} />
							<ReactQueryDevtools />
						</>
					</FilterContextProvider>
				</AuthProvider>
			</ChakraProvider>
		</QueryClientProvider>
	)
}

export default MyApp
