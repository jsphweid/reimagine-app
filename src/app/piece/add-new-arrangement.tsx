import { useState } from "react";

import { Spinner } from "../../components/spinner";
import { useCreateSimpleArrangementMutation } from "../../generated";
import AudioDropzone from "../small-components/audio-dropzone";
import { toBase64 } from "../../utils";

interface AddNewArrangementProps {
  onNewArrangement?: () => void;
  pieceId: string;
}

function AddNewArrangement(props: AddNewArrangementProps) {
  const [name, setName] = useState("");
  const [filename, setFilename] = useState("");
  const [base64Blob, setBase64Blob] = useState("");
  const [createArr, { loading }] = useCreateSimpleArrangementMutation({
    notifyOnNetworkStatusChange: true,
  });

  function handleSave() {
    createArr({
      variables: {
        name,
        base64Blob: base64Blob.split(",")[1],
        pieceId: props.pieceId,
      },
    }).then(() => {
      setName("");
      setBase64Blob("");
      setFilename("");
      if (props.onNewArrangement) {
        props.onNewArrangement();
      }
    });
  }

  async function handleFiles(files: File[]) {
    if (files.length === 1) {
      const base64Blob = await toBase64(files[0]);
      setFilename(files[0].name);
      setBase64Blob(base64Blob);
    }
  }

  function renderDropzone() {
    return filename ? (
      <p>{filename}</p>
    ) : (
      <AudioDropzone onFiles={handleFiles} />
    );
  }

  return (
    <div className="reimagine-addNewArrangement">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {renderDropzone()}
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}

export default AddNewArrangement;
