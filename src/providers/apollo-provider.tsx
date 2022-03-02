import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import { useAuth0 } from "@auth0/auth0-react";

const AuthorizedApolloProvider = ({ children }: any) => {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV === "development"
        ? "http://localhost:4000/graphql"
        : "https://api.carryoaky.com/graphql",
  });

  const authLink = setContext(async () => {
    const token = await getAccessTokenSilently();

    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {},
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
