import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import About from "./about/about";
import Admin from "./admin/admin";
import Navigation from "./navigation/navigation";
import Settings from "./settings/settings";
import Listen from "./listen/listen";
import MyRecordings from "./my-recordings/my-recordings";
import Recording from "./recording/recording";
import { SpinnerIcon } from "../icon";

function Main() {
  const { isLoading } = useAuth0();

  const mainArea = isLoading ? (
    <div className="reimagine-mainArea-spinner">
      <SpinnerIcon isLoading={true} size="50px" />
    </div>
  ) : (
    <Switch>
      <Route path="/recording">
        <Recording />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/listen">
        <Listen />
      </Route>
      <Route path="/my-recordings">
        <MyRecordings />
      </Route>
      <Route path="/">
        <About />
      </Route>
    </Switch>
  );

  return (
    <div className="reimagine">
      <Navigation />
      <div className="reimagine-mainArea">{mainArea}</div>
    </div>
  );
}

export default Main;
