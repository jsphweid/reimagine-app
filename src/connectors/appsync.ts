import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import Amplify, { Auth } from 'aws-amplify'
import { amplifyConfig } from './amplify'

Amplify.configure(amplifyConfig)

export default new AWSAppSyncClient({
	url:
		'https://75lfetemxvfwfdhf74movp42oq.appsync-api.us-east-1.amazonaws.com/graphql',
	region: 'us-east-1',
	auth: {
		type: AUTH_TYPE.AWS_IAM,
		credentials: () => Auth.currentCredentials()
	},
	disableOffline: true
} as any)
