import { createContext, useContext } from "react";

import { Env } from "../models/env";

let domain = "dev-p3nv00ki.us.auth0.com";
let clientId = "31VwMqMKGBeQqMwD26efB3qA08ANXKpk";
let audience = "https://hello-world.example.com";
let apiServerUrl = "http://localhost:6060";

if (process.env.NODE_ENV !== "development") {
  domain = "carryoaky.us.auth0.com";
  clientId = "ooLI4bCTS8wVS63S1AKpsUNdTPYXx68r";
  audience = "https://api.carryoaky.com";
  apiServerUrl = "https://api.carryoaky.com";
}

const isEnvValid = domain && clientId && audience && apiServerUrl;

if (!isEnvValid) {
  throw new Error("Missing environment variables.");
}

const dotenv: Env = {
  domain: domain,
  clientId: clientId,
  audience: audience,
  apiServerUrl: apiServerUrl,
};

export const EnvContext = createContext<Env>(dotenv);

export const useEnv = () => {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error(`useEnv must be used within a EnvProvider`);
  }
  return context;
};

export const EnvProvider: React.FC = (props) => {
  return <EnvContext.Provider value={dotenv} {...props} />;
};
