import { useHistory } from "react-router-dom";
import { useState } from "react";

import Section from "../small-components/section";
import { useQueryParams } from "../../hooks/use-query-params";
import { Spinner } from "../../components/spinner";
import RecordingSelection from "./recording-selection";
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

// TODO: This whole get arrangement by recording Id is
// just a sign the DB needs to be denormalized more
function CreateMix() {
  const { params } = useQueryParams();
  const recordingId = params.get("recordingId");
  const [firstLoad, setFirstLoad] = useState(false);
  const history = useHistory();

  // mapping of segmentId -> selected recording id
  const [selected, setSelected] = useState(
    {} as { [key: string]: string | null }
  );

  const { data, loading } = useGetArrangementForMixingQuery({
    variables: { recordingId: recordingId! },
    skip: !recordingId,
    onCompleted: (data) => {
      if (!firstLoad) {
        data.getArrangementByRecordingId?.myRecordings?.forEach((r) => {
          if (r.id === recordingId) {
            setSelected({ [r.segmentId]: recordingId });
          }
        });
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
              recordings={segmentToRecordings[s.id]}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
}

export default CreateMix;
