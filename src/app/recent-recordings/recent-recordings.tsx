import React from "react";
import { Recording } from "src/generated";

import { timeSince } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";
import PlayIconWrapper from "../small-components/play-icon";
import Section from "../small-components/section";

function RecentRecordings() {
  const recordings: Recording[] = []; // TODO: load from remote (obviously)

  function renderRecordingItem(recording: Recording) {
    const name = "[Untitled]";
    const date = new Date(recording.dateCreated).getTime();
    return (
      <li key={recording.dateCreated}>
        <div className="reimagine-recentRecordings-item-text">
          {name}
          <br />
          {timeSince(date)}
        </div>
        <div className="reimagine-recentRecordings-item-icons">
          <PlayIconWrapper recording={recording} />
          <UploadIconWrapper recording={recording} />
        </div>
      </li>
    );
  }

  const recordingItems = recordings.map(renderRecordingItem).reverse();

  const content = recordings.length ? (
    <ul>{recordingItems}</ul>
  ) : (
    <p>You haven't made any recordings yet.</p>
  );

  return (
    <Section className="reimagine-recentRecordings" title="Recent Recordings">
      {content}
    </Section>
  );
}

export default RecentRecordings;
