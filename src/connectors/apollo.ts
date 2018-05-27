import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'cross-fetch'

const client = new ApolloClient({
	link: new HttpLink({
		fetch,
		uri: 'https://fv83gmy1pk.execute-api.us-east-1.amazonaws.com/dev/graphql'
	}),
	cache: new InMemoryCache()
})

export default client
