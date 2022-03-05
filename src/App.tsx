import ReactGa from "react-ga";

import Main from "./app/main";
import "./app.scss";

ReactGa.initialize("G-7CDJBDRTTX");

export const App: React.FC = () => {
  return <Main />;
};
