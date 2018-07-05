import Amplify, { Auth } from 'aws-amplify'

export const amplifyConfig = {
	Auth: {
		identityPoolId: 'us-east-1:b586906e-de18-480d-bcf2-b11d318e52d2',
		region: 'us-east-1'
	}
}

Amplify.configure(amplifyConfig)

export const signOut = async () =>
	await Auth.signOut().catch(err => console.log('signOut failure', err))

export const getCurrentAuthenticatedUser = async () =>
	await Auth.currentAuthenticatedUser().catch(err =>
		console.log('currentAuthenticatedUser error', err)
	)

export const getCurrentCredentials = async () =>
	await Auth.currentCredentials().catch(err =>
		console.log('currentCredentials error', err)
	)
