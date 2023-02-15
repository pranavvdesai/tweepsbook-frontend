import type { Dispatch } from 'react'

import type { Profile } from './Profile.type'

export enum AuthStatus {
	AUTHENTICATING = 'AUTHENTICATING',
	AUTHENTICATED = 'AUTHENTICATED',
	NOT_INITIATED = 'NOT_INITIATED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
}

type Credential = {
	profile: Profile
	sessionToken: string
}

type AuthenticatedState = {
	authStatus: AuthStatus.AUTHENTICATED
	credentials: Credential
}

type UnauthenticatedState = {
	authStatus:
		| AuthStatus.AUTHENTICATING
		| AuthStatus.NOT_INITIATED
		| AuthStatus.UNAUTHENTICATED
	credentials: null
}

export type AuthState = AuthenticatedState | UnauthenticatedState

export enum AuthActionTypes {
	AUTHENTICATE = 'AUTHENTICATE',
	AUTHENTICATING = 'AUTHENTICATING',
	UNAUTHENTICATE = 'UNAUTHENTICATE',
}

interface AuthenticatingAction {
	type: AuthActionTypes.AUTHENTICATING
	payload: {
		authStatus: AuthStatus.AUTHENTICATING
		credentials: null
	}
}

interface AuthenticateAction {
	type: AuthActionTypes.AUTHENTICATE
	payload: {
		authStatus: AuthStatus.AUTHENTICATED
		credentials: Credential
	}
}

interface UnauthenticateAction {
	type: AuthActionTypes.UNAUTHENTICATE
	payload: {
		authStatus: AuthStatus.UNAUTHENTICATED
		credentials: null
	}
}

export type AuthActions =
	| AuthenticatingAction
	| AuthenticateAction
	| UnauthenticateAction

export interface AuthContext {
	auth: {
		authStatus: AuthStatus
		credentials: Credential | null
	}
	authDispatch: Dispatch<AuthActions>
}
