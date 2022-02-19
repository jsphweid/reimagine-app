import React from "react";

import { timeSince } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";
import PlayIconWrapper from "../small-components/play-icon";
import Section from "../small-components/section";
import { useStore } from "../../providers/store";
import { AnyRecording } from "../../types";

function RecentRecordings() {
  const { store } = useStore();
  const recordings: Array<AnyRecording> = store.localRecordings;

  function renderRecordingItem(recording: AnyRecording) {
    const name = "[Untitled]";
    const date = new Date(recording.dateCreated).getTime();
    const key = `${date}`;
    return (
      <li key={key}>
        <div className="reimagine-recentRecordings-item-text">
          {name}
          <br />
          {timeSince(date)}
        </div>
        <div className="reimagine-recentRecordings-item-icons">
          <PlayIconWrapper recording={recording} />
          {/* <UploadIconWrapper recording={recording} /> */}
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
