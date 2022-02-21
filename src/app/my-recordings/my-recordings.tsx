import { useAuth0 } from "@auth0/auth0-react";

import UploadIconWrapper from "../small-components/upload-icon";
import Section from "../small-components/section";
import { useStore } from "../../providers/store";
import { AnyRecording, isLocalRecording } from "../../types";
import { useGetRecordingsQuery } from "../../generated";
import Audios from "../small-components/audios";

function MyRecordings() {
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

  const audioItems = recordings.map((r) => {
    return isLocalRecording(r)
      ? {
          ...r,
          url: URL.createObjectURL(r.blob),
          uploadIcon: <UploadIconWrapper recording={r} />,
        }
      : { ...r, url: r.url };
  });

  return (
    <Section title="My Recordings">
      <Audios items={audioItems} />
    </Section>
  );
}

export default MyRecordings;
