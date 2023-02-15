import type { AuthActions, AuthState } from '@/types'
import { AuthActionTypes } from '@/types'

export const authReducer = (
	state: AuthState,
	{ payload, type }: AuthActions
) => {
	switch (type) {
		case AuthActionTypes.AUTHENTICATE:
			return {
				...state,
				authStatus: payload.authStatus,
				credentials: payload.credentials,
			}
		case AuthActionTypes.AUTHENTICATING:
			return {
				...state,
				authStatus: payload.authStatus,
				credentials: payload.credentials,
			}
		case AuthActionTypes.UNAUTHENTICATE:
			return {
				...state,
				authStatus: payload.authStatus,
				credentials: payload.credentials,
			}
		default:
			return state
	}
}
