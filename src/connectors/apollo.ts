import ApolloClient from 'apollo-boost'
// import { HttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import fetch from 'cross-fetch'

const client = new ApolloClient({
	uri: 'https://fv83gmy1pk.execute-api.us-east-1.amazonaws.com/dev/graphql'
})

export default client
