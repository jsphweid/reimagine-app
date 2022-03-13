import { useHistory } from "react-router-dom";
import { useState } from "react";

import Section from "../small-components/section";
import { useQueryParams } from "../../hooks/use-query-params";
import { Spinner } from "../../components/spinner";
import RecordingSelection from "./recording-selection";
import { useStore } from "../../providers/store";
import {
  Recording,
  useGetArrangementForMixingQuery,
  GetArrangementForMixingQuery,
  useCreateMixMutation,
} from "../../generated";

export type MinimalSegment = NonNullable<
  NonNullable<
    GetArrangementForMixingQuery["getArrangementByRecordingId"]
  >["segments"]
>[0];

// mapping of segmentId -> selected recording id
type SelectedMap = { [key: string]: string | null };

function makeMapping(recordings: Recording[]) {
  const res = {} as { [key: string]: Recording[] };
  for (const recording of recordings) {
    if (res[recording.segmentId]) {
      res[recording.segmentId].push(recording);
    } else {
      res[recording.segmentId] = [recording];
    }
  }
  return res;
}

function createdSelectedMap(
  recordings: Recording[],
  recentlyUploaded: string[]
): SelectedMap {
  const keep = new Set(recentlyUploaded);
  const res: SelectedMap = {};

  // TODO: this should be ordered by default latest first...
  const recent = recordings.filter((r) => keep.has(r.id));
  for (const recording of recent) {
    if (recording.segmentId in res) {
      continue;
    } else {
      res[recording.segmentId] = recording.id;
    }
  }
  return res;
}

// TODO: This whole get arrangement by recording Id is
// just a sign the DB needs to be denormalized more
function CreateMix() {
  const { params } = useQueryParams();
  const recordingId = params.get("recordingId");
  const [firstLoad, setFirstLoad] = useState(false);
  const history = useHistory();
  const { store } = useStore();
  const [selected, setSelected] = useState({} as SelectedMap);

  const { data, loading } = useGetArrangementForMixingQuery({
    variables: { recordingId: recordingId! },
    skip: !recordingId,
    onCompleted: (data) => {
      if (!firstLoad) {
        const recordings = data.getArrangementByRecordingId?.myRecordings;
        if (recordings) {
          const selected = createdSelectedMap(
            recordings,
            store.recentlyUploaded
          );
          setSelected(selected);
        }
        setFirstLoad(true);
      }
    },
  });

  const [createMix, { loading: creating }] = useCreateMixMutation();

  function handleCreate() {
    createMix({
      variables: {
        recordingIds: Object.values(selected).filter(Boolean) as string[],
        // for now we'll hard code these, but they could easily be options in UI
        allowPartial: true,
        fill: true,
      },
    }).then(() => history.push("/listen"));
  }

  if (!recordingId) {
    return <p>No recording in the query params...</p>;
  }

  const myRecordings = data?.getArrangementByRecordingId?.myRecordings ?? [];
  const segmentToRecordings = makeMapping(myRecordings);

  let segments = data?.getArrangementByRecordingId?.segments ?? [];

  if (loading || creating) {
    return <Spinner />;
  }

  return (
    <Section title="Create Mix">
      {firstLoad ? (
        <div className="reimagine-createMix">
          <p>Select the recordings you want to use and click Create!</p>
          <button onClick={handleCreate}>Create</button>
          {segments.map((s) => (
            <RecordingSelection
              key={s.id}
              selected={selected[s.id]}
              onSelect={(id) => setSelected({ ...selected, [s.id]: id })}
              segment={s}
              recordings={segmentToRecordings[s.id] || []}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
}

export default CreateMix;
