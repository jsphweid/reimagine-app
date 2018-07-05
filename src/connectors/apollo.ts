import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  uri: 'https://fv83gmy1pk.execute-api.us-east-1.amazonaws.com/dev/graphql'
})

export default client
