import { ColorModeScript } from '@chakra-ui/react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

import { AppConfig } from '@/utils/AppConfig'

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
	// eslint-disable-next-line class-methods-use-this
	render() {
		return (
			<Html lang={AppConfig.locale}>
				<Head>
					<meta name='title' content='TweepsBook' />
					<meta
						name='description'
						content='A tool that brings all your social bookmarks to one place, automatically categorizing them into different collections.'
					/>

					<meta property='og:type' content='website' />
					<meta property='og:url' content='https://tweepsbook.com' />
					<meta property='og:title' content='TweepsBook' />
					<meta
						property='og:description'
						content='A tool that brings all your social bookmarks to one place, automatically categorizing them into different collections.'
					/>
					<meta
						property='og:image'
						content='https://i.postimg.cc/ZKpQqNJx/Twitter-Banner4-5.jpg'
					/>

					<meta name='twitter:card' content='summary_large_image' />
					<meta name='twitter:url' content='https://tweepsbook.com' />
					<meta name='twitter:title' content='TweepsBook' />
					<meta
						name='twitter:description'
						content='A tool that brings all your social bookmarks to one place, automatically categorizing them into different collections.'
					/>
					<meta
						name='twitter:image'
						content='https://i.postimg.cc/ZKpQqNJx/Twitter-Banner4-5.jpg'
					/>
					<link rel='shortcut icon' href='/favicon.svg' />
					<Script
						id='crisp-script'
						type='text/javascript'
						onLoad={() => {
							// @ts-ignore
							window.$crisp = []
							// @ts-ignore
							window.CRISP_WEBSITE_ID =
								'98638430-376d-4ebb-8ef6-a3f7fb524cad'
							;(() => {
								const d = document
								const s = d.createElement('script')
								s.src = 'https://client.crisp.chat/l.js'
								s.async = true
								if (d) {
									d.getElementsByTagName(
										'head'
									)[0]?.appendChild(s)
								}
							})()
						}}
					/>
				</Head>
				<body>
					<ColorModeScript />
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
