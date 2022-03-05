import ReactGa from "react-ga";

import Main from "./app/main";
import "./app.scss";

ReactGa.initialize("UA-222099610-1");

export const App: React.FC = () => {
  return <Main />;
};
