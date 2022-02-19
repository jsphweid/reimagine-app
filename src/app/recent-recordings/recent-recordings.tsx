import { useAuth0 } from "@auth0/auth0-react";

import { timeSince } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";
import PlayIconWrapper from "../small-components/play-icon";
import Section from "../small-components/section";
import { useStore } from "../../providers/store";
import { AnyRecording, isLocalRecording } from "../../types";
import { useGetRecordingsQuery } from "../../generated";

function RecentRecordings() {
  const { user } = useAuth0();
  const userId = user?.sub as string;
  const { store } = useStore();
  const { data } = useGetRecordingsQuery({ variables: { userId } });

  // NOTE: this shouldn't be done every render
  const localRecordings = store.localRecordings;
  const remoteRecordings = data?.getRecordingsByUserId?.filter(Boolean) || [];
  const recordings = [
    ...localRecordings,
    ...remoteRecordings,
  ] as AnyRecording[];
  recordings.sort((a, b) =>
    new Date(b.dateCreated) > new Date(a.dateCreated) ? 1 : -1
  );

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
          {isLocalRecording(recording) ? (
            <UploadIconWrapper recording={recording} />
          ) : null}
          <PlayIconWrapper recording={recording} />
        </div>
      </li>
    );
  }

  const recordingItems = recordings.map(renderRecordingItem);

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
