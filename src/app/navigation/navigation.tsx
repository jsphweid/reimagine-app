import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { usePermissions } from "../../hooks/use-permissions";

import {
  BarsIcon,
  CabinetIcon,
  CloseIcon,
  CogIcon,
  ComputerIcon,
  HeadphonesIcon,
  InfoIcon,
  LoginIcon,
  LogoutIcon,
  MicrophoneIcon,
  WorldIcon,
} from "../../icon";

export function Navigation() {
  const [headerExpanded, setHeaderExpanded] = React.useState(false);
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const { isAdmin } = usePermissions();
  const history = useHistory();
  const { pathname } = useLocation();

  function goto(route: string) {
    history.push(route);
    setHeaderExpanded(false);
  }

  function renderQuickSwap() {
    return pathname === "/recording" ? (
      <HeadphonesIcon onClick={() => goto("/listen")} />
    ) : (
      <MicrophoneIcon onClick={() => goto("/recording")} />
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
    return isAuthenticated ? (
      <li onClick={handleLogout}>
        <div>Logout</div>
        <LogoutIcon />
      </li>
    ) : (
      <li onClick={loginWithRedirect}>
        <div>Login</div>
        <LoginIcon />
      </li>
    );
  }

  function renderPossibleAdminSection() {
    return isAdmin ? renderMenuItem("Admin", <ComputerIcon />, "/admin") : null;
  }

  function renderPossibleOverlay() {
    return headerExpanded ? (
      <div className="reimagine-navigation-overlay">
        <ul>
          {renderMenuItem("Main", <MicrophoneIcon />, "/recording")}
          {renderMenuItem("My Recordings", <CabinetIcon />, "/my-recordings")}
          {renderMenuItem("My Mixes", <HeadphonesIcon />, "/listen")}
          {renderMenuItem("Explore", <WorldIcon />, "/pieces")}
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
        carryoaky
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
