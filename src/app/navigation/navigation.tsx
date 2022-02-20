import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useHistory, useLocation } from "react-router-dom";

import {
  BarsIcon,
  CloseIcon,
  CogIcon,
  ComputerIcon,
  HeadphonesIcon,
  InfoIcon,
  MicrophoneIcon,
  RecordingIcon,
} from "../../icon";

export function Navigation() {
  const [headerExpanded, setHeaderExpanded] = React.useState(false);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const { pathname } = useLocation();

  function goto(route: string) {
    history.push(route);
    setHeaderExpanded(false);
  }

  function renderQuickSwap() {
    return pathname === "/interactive" ? (
      <RecordingIcon onClick={() => goto("/recordings")} />
    ) : (
      <MicrophoneIcon onClick={() => goto("/interactive")} />
    );
  }

  function renderBarsOrClose() {
    return headerExpanded ? (
      <CloseIcon onClick={() => setHeaderExpanded(false)} />
    ) : (
      <BarsIcon onClick={() => setHeaderExpanded(true)} />
    );
  }

  function renderMenuItem(text: string, icon: JSX.Element, route: string) {
    return (
      <li>
        <Link onClick={() => setHeaderExpanded(false)} to={route}>
          <div>{text}</div>
          {icon}
        </Link>
      </li>
    );
  }

  function renderLoginLogout() {
    const handleLogout = () =>
      logout({
        returnTo: window.location.origin,
      });

    return (
      <li onClick={isAuthenticated ? handleLogout : loginWithRedirect}>
        <div>{isAuthenticated ? "Logout" : "Login"}</div>
      </li>
    );
  }

  function renderPossibleAdminSection() {
    // TODO: change to only if admin permission on token
    return renderMenuItem("Admin", <ComputerIcon />, "/admin");
  }

  function renderPossibleOverlay() {
    return headerExpanded ? (
      <div className="reimagine-navigation-overlay">
        <ul>
          {renderMenuItem("Main", <MicrophoneIcon />, "/interactive")}
          {renderMenuItem(
            "Recent Recordings",
            <RecordingIcon />,
            "/recordings"
          )}
          {renderMenuItem("Listen to Mixes", <HeadphonesIcon />, "/listen")}
          {renderMenuItem("Settings", <CogIcon />, "/settings")}
          {renderMenuItem("About", <InfoIcon />, "/about")}
          {renderPossibleAdminSection()}
          {renderLoginLogout()}
        </ul>
      </div>
    ) : null;
  }

  return (
    <div className="reimagine-navigation">
      <h1 className="reimagine-navigation-title" onClick={() => goto("/about")}>
        re:imagine
      </h1>
      <div className="reimagine-navigation-mainIcons">
        {renderQuickSwap()}
        {renderBarsOrClose()}
      </div>
      {renderPossibleOverlay()}
    </div>
  );
}

export default Navigation;
