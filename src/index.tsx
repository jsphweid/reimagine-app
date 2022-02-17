import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";
import { EnvProvider } from "./context/env.context";
import { StoreProvider } from "./providers/store";
import AuthorizedApolloProvider from "./providers/apollo-provider";
import { AudioEngineProvider } from "./providers/audio-engine-provider";
import { App } from "./app";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <EnvProvider>
          <Auth0ProviderWithHistory>
            <AuthorizedApolloProvider>
              <AudioEngineProvider>
                <App />
              </AudioEngineProvider>
            </AuthorizedApolloProvider>
          </Auth0ProviderWithHistory>
        </EnvProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
