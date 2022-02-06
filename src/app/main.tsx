import React from "react";

import { useStore } from "../store";
import About from "./about/about";
import { Section } from "../common/constants";
import Admin from "./admin/admin";
import Navigation from "./navigation/navigation";
import Settings from "./settings/settings";
// import { SegmentType } from "../common/types";
// import { MainSection } from "../common/constants";
// import Settings from './settings/settings'
import Listen from "./listen/listen";
import RecentRecordings from "./recent-recordings/recent-recordings";
import Interactive from "./interactive/interactive";

function Main() {
  const { store } = useStore();

  const renderMainArea = () => {
    switch (store.activeSection) {
      default:
      case Section.Interactive:
        return <Interactive />;
      case Section.Settings:
        return <Settings />;
      case Section.RecentRecordings:
        return <RecentRecordings />;
      case Section.About:
        return <About />;
      case Section.Listen:
        return <Listen />;
      case Section.Admin:
        return <Admin />;
    }
  };

  return (
    <div className="reimagine">
      <Navigation />
      <div className="reimagine-mainArea">{renderMainArea()}</div>
    </div>
  );
}

export default Main;
