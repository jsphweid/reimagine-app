import { useState } from "react";

import { useCreatePieceMutation } from "../../generated";
import { Spinner } from "../../components/spinner";

interface AddNewPieceProps {
  onNewPiece?: () => void;
}

function AddNewPiece(props: AddNewPieceProps) {
  const [name, setName] = useState("");
  const [createPiece, { loading }] = useCreatePieceMutation({
    notifyOnNetworkStatusChange: true,
  });

  function handleSave() {
    createPiece({ variables: { name } }).then(() => {
      setName("");
      if (props.onNewPiece) {
        props.onNewPiece();
      }
    });
  }

  return (
    <div className="reimagine-addNewPiece">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}

export default AddNewPiece;
