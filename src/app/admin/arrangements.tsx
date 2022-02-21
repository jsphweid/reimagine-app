import { useEffect, useState } from "react";

import {
  useCreateSimpleArrangementMutation,
  useGetArrangementsLazyQuery,
  useDeleteArrangementMutation,
} from "../../generated";
import AudioDropzone from "./audio-dropzone";
import { toBase64 } from "../../utils";

interface ArrangementsProps {
  pieceId: string;
}

function Arrangements(props: ArrangementsProps) {
  const [name, setName] = useState("some arrangement");
  const [createArr, createArrRes] = useCreateSimpleArrangementMutation();
  const [deleteArr, deleteArrRes] = useDeleteArrangementMutation();
  const [getArr, getArrRes] = useGetArrangementsLazyQuery();

  useEffect(() => {
    getArr({ variables: { pieceId: props.pieceId } });
  }, []);

  async function handleDeleteArrangement(id: string) {
    await deleteArr({ variables: { arrangementId: id } });
    getArrRes.refetch();
  }

  async function handleFiles(files: File[]) {
    if (files.length === 1) {
      const base64Blob = await toBase64(files[0]);
      await createArr({
        variables: {
          name,
          base64Blob: base64Blob.split(",")[1],
          pieceId: props.pieceId,
        },
      });
      getArrRes.refetch();
    }
  }

  function renderArrangementCreation() {
    const arrangement = createArrRes.data?.createSimpleArrangement;
    if (createArrRes.error) {
      return <p>Error: {createArrRes.error.message}</p>;
    } else if (arrangement) {
      return <p>Created arrangement {arrangement.id}</p>;
    } else if (createArrRes.loading) {
      return <p>"Creating arrangement..."</p>;
    }

    return null;
  }

  function renderArrangements() {
    const arrangements = getArrRes.data?.getArrangementsByPieceId;
    if (arrangements) {
      return (
        <ul>
          {arrangements.map((a) =>
            a ? (
              <li key={a.id}>
                <p>ID: {a.id!}</p>
                <button onClick={() => handleDeleteArrangement(a.id!)}>
                  delete
                </button>
              </li>
            ) : null
          )}
        </ul>
      );
    }
    return null;
  }

  return (
    <>
      {renderArrangements()}
      {renderArrangementCreation()}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <AudioDropzone onFiles={handleFiles} />
    </>
  );
}

export default Arrangements;
