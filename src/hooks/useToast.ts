import type { UseToastOptions } from '@chakra-ui/react'
import { useToast as useChakraToast } from '@chakra-ui/react'

export const useToast = () => {
	const toast = useChakraToast()

	const Toast = (
		description: string,
		title: string,
		status: UseToastOptions['status']
	) => {
		toast({
			title,
			description,
			status,
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

	return Toast
}
