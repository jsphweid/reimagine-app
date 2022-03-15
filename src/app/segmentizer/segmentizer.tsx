import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import MidiSegmentizer from "midi-segmentizer/dist/segmentizer";
import { Segment } from "midi-segmentizer";

import { useCreateArrangementMutation } from "../../generated";
import { useQueryParams } from "../../hooks/use-query-params";
import AudioDropzone from "../small-components/audio-dropzone";
import { toBase64 } from "../../utils";
import { Spinner } from "../../components/spinner";

function Segmentizer() {
  const [data, setData] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [create, { loading }] = useCreateArrangementMutation();
  const { params } = useQueryParams();
  const pieceId = params.get("pieceId");
  const history = useHistory();

  if (loading) {
    return <Spinner />;
  }

  if (!pieceId) {
    return <p>need a piece id...</p>;
  }

  if (!data) {
    return (
      <AudioDropzone
        onFiles={async (files) => {
          if (files.length === 1) {
            const base64 = await toBase64(files[0]);
            setData(base64.replace("data:audio/midi;base64,", ""));
          }
        }}
      />
    );
  }

  function handleSave(segments: Segment[]) {
    if (!name) {
      throw new Error("Name is required!");
    }

    create({
      variables: {
        name,
        segments: segments.map((segment) => ({
          bpm: segment.bpm,
          offset: segment.offset,
          notes: segment.notes.map((note) => ({
            time: note.time,
            midi: note.midi,
            duration: note.duration,
            velocity: 1,
            lyric: note.lyric,
          })),
        })),
        pieceId: pieceId!,
      },
    }).then(({ data }) => {
      const arrangementId = data?.createArrangement?.id;
      if (arrangementId) {
        history.push(`/arrangements/${arrangementId}`);
      }
    });
  }

  return (
    <div>
      <input onChange={(e) => setName(e.target.value)} value={name} />
      {data && <MidiSegmentizer data={data} onSave={handleSave} />}
    </div>
  );
}

export default Segmentizer;
