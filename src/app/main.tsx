import { Route, Switch } from "react-router-dom";

import About from "./about/about";
import Admin from "./admin/admin";
import Navigation from "./navigation/navigation";
import Settings from "./settings/settings";
import Listen from "./listen/listen";
import MyRecordings from "./my-recordings/my-recordings";
import Recording from "./recording/recording";

function Main() {
  return (
    <div className="reimagine">
      <Navigation />
      <div className="reimagine-mainArea">
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
      </div>
    </div>
  );
}

export default Main;
