/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xxs: '375px',
			xs: '464px',
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '4rem',
		},
		extend: {
			backgroundImage: {
				'grid-pattern':
					'linear-gradient(90deg, #EDEDED 1px, transparent 1px), linear-gradient(180deg, #EDEDED 1px, transparent 1px)',
				hero: "url('/landingbg.svg')",
				'grid-patterndark':
					'linear-gradient(90deg, #ededed0f 0.4px, transparent 0.1px), linear-gradient(180deg, #ededed0f 0.4px, transparent 0.1px)',
			},
			backgroundSize: {
				'grid-size':
					'clamp(5rem, 3.58rem + 5vw, 10rem) clamp(5rem, 3.58rem + 5vw, 10rem)',
			},
			colors: {
				gray: {
					100: '#f7fafc',
					200: '#edf2f7',
					300: '#e2e8f0',
					400: '#cbd5e0',
					500: '#a0aec0',
					600: '#718096',
					700: '#4a5568',
					800: '#2d3748',
					900: '#1a202c',
				},
				blue: {
					100: '#ebf8ff',
					200: '#bee3f8',
					300: '#90cdf4',
					400: '#63b3ed',
					500: '#4299e1',
					600: '#3182ce',
					700: '#2b6cb0',
					800: '#2c5282',
					900: '#2a4365',
				},
				'twitter-blue': '#55ACEE',
				'linkedin-blue': '#0A66C2',
				'keep-yellow': '#FFBA00',
				'pinterest-red': '#CB1F27',
				'reddit-orange': '#FF4500',
				custom: '#708FFF',
				cardblue: '#55ACEE',
				hrcolor: '#707070',
				cardgray: '#707070',
				textgray: '#707070',
				sidebargray: '#F2F2F2',
				textprimary: '#0A1334',
				textdark: '#F5F5F5',
				bordersidebar: 'rgba(206, 206, 206, 0.4)',
				borderinput: 'rgba(112, 112, 112, 0.5)',
				bordersidebarsettings: 'rgba(112, 112, 112, 0.2)',
				bordersearchbar: '0px 4px 4px rgba(176, 176, 176, 0.15)',
				switchblue:
					'linear-gradient(159.64deg, #55ACEE 13.53%, #A1D4FB 88.25%)',
				borderdarkcard: '0.4px solid rgba(128, 200, 255, 0.6)',
				borderdarkinput: '0.4px solid rgba(206, 206, 206, 0.5)',
				borderdarksearchbar: 'rgba(206, 206, 206, 0.6)',
				borderconnectiondark: 'rgba(206, 206, 206, 0.5)',
				borderinputfilter: 'rgba(85, 172, 238, 0.6)',
			},
			fontFamily: {
				Karla: ['Karla', 'sans-serif'],
			},
			boxShadow: {
				'3xl': '0px 4px 4px rgba(205, 205, 205, 0.15)',
				'4xl': ' 0px 4px 4px rgba(84, 84, 84, 0.05)',
			},
			padding: {
				'canvas-tb': 'var(--canvas-toolbar-padding)',
			},
			translate: {
				'canvas-sub-tb':
					'calc(-100% + calc(-5px - var(--canvas-toolbar-padding)))',
			},
		},
	},
	plugins: [],
}
