import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import { Loader } from "./components/loader";
import Main from "./app/main";
import "./app.scss";

export const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <Loader />
      </div>
    );
  }

  return <Main />;
};
