import React from "react";
import { IoIosRecording as RecordingIcon } from "react-icons/io";
import {
  FaBars as BarsIcon,
  FaCog as CogIcon,
  FaInfoCircle as InfoIcon,
  FaMicrophone as MicrophoneIcon,
  FaDesktop as ComputerIcon,
  FaTimes as CloseIcon,
  FaHeadphones as HeadphonesIcon,
} from "react-icons/fa";

import { Section } from "../../common/constants";
import { useStore } from "../../store";

interface NavigationProps {
  id?: string;
}

export function Navigation(props: NavigationProps) {
  const { store, setStore } = useStore();
  const [headerExpanded, setHeaderExpanded] = React.useState(false);

  function genActivate(section: Section) {
    return () => {
      setHeaderExpanded(false);
      setStore({ activeSection: section });
    };
  }

  function renderQuickSwap() {
    return store.activeSection === Section.Interactive ? (
      <RecordingIcon onClick={genActivate(Section.RecentRecordings)} />
    ) : (
      <MicrophoneIcon onClick={genActivate(Section.Interactive)} />
    );
  }

  function renderBarsOrClose() {
    return headerExpanded ? (
      <CloseIcon onClick={() => setHeaderExpanded(false)} />
    ) : (
      <BarsIcon onClick={() => setHeaderExpanded(true)} />
    );
  }

  function renderMenuItem(text: string, icon: JSX.Element, section: Section) {
    return (
      <li onClick={genActivate(section)}>
        <div>{text}</div>
        {icon}
      </li>
    );
  }

  function renderPossibleAdminSection() {
    // TODO: change to only if admin permission on token
    return renderMenuItem("Admin", <ComputerIcon />, Section.Admin);
  }

  function renderPossibleOverlay() {
    return headerExpanded ? (
      <div className="reimagine-navigation-overlay">
        <ul>
          {renderMenuItem("Main", <MicrophoneIcon />, Section.Interactive)}
          {renderMenuItem(
            "Recent Recordings",
            <RecordingIcon />,
            Section.RecentRecordings
          )}
          {renderMenuItem("Listen", <HeadphonesIcon />, Section.Listen)}
          {renderMenuItem("Settings", <CogIcon />, Section.Settings)}
          {renderMenuItem("About", <InfoIcon />, Section.About)}
          {renderPossibleAdminSection()}
        </ul>
      </div>
    ) : null;
  }

  return (
    <div className="reimagine-navigation">
      <h1
        className="reimagine-navigation-title"
        onClick={genActivate(Section.About)}
      >
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
