import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import About from "./about/about";
import Admin from "./admin/admin";
import Navigation from "./navigation/navigation";
import Settings from "./settings/settings";
import Listen from "./listen/listen";
import MyRecordings from "./my-recordings/my-recordings";
import Recording from "./recording/recording";
import { Spinner } from "../components/spinner";
import Pieces from "./pieces/pieces";
import Piece from "./piece/piece";
import Arrangement from "./arrangement/arrangement";
import CreateMix from "./create-mix/create-mix";
import Segmentizer from "./segmentizer/segmentizer";
import AdminRoute from "../components/admin-route";

function Main() {
  const { isLoading } = useAuth0();

  const mainArea = isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route path="/recording">
        <Recording />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <AdminRoute path="/admin">
        <Admin />
      </AdminRoute>
      <AdminRoute path="/segmentizer">
        <Segmentizer />
      </AdminRoute>
      <Route path="/listen">
        <Listen />
      </Route>
      <Route path="/create-mix">
        <CreateMix />
      </Route>
      <Route path="/arrangements/:arrangementId">
        <Arrangement />
      </Route>
      <Route path="/pieces/:pieceId">
        <Piece />
      </Route>
      <Route path="/pieces">
        <Pieces />
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
