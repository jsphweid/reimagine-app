import React from "react";

import { Recording } from "../../common/types";
import { timeSince } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";
import PlayIconWrapper from "../small-components/play-icon";
import Section from "../small-components/section";

function RecentRecordings() {
  const recordings: any[] = []; // TODO: load from remote (obviously)

  function renderRecordingItem(recording: Recording) {
    const name = recording.segment.humanHash || "[Untitled]";
    const date = new Date(recording.recordingDate).getTime();
    return (
      <li key={recording.recordingDate}>
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
