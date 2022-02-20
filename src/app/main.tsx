import { Route, Switch } from "react-router-dom";

import About from "./about/about";
import Admin from "./admin/admin";
import Navigation from "./navigation/navigation";
import Settings from "./settings/settings";
import Listen from "./listen/listen";
import RecentRecordings from "./recent-recordings/recent-recordings";
import Interactive from "./interactive/interactive";

function Main() {
  return (
    <div className="reimagine">
      <Navigation />
      <div className="reimagine-mainArea">
        <Switch>
          <Route path="/interactive">
            <Interactive />
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
          <Route path="/recordings">
            <RecentRecordings />
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
