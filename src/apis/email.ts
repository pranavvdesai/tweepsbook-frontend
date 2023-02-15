import type { AxiosResponse } from 'axios'
import axios from 'axios'

export const checkEmailDisposability = (email: string) => {
	return axios.get('https://disposable.debounce.io/', {
		params: { email },
	}) as Promise<AxiosResponse<{ disposable: boolean }>>
}
