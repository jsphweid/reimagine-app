import Section from "../small-components/section";
import { useGetAllPiecesQuery } from "../../generated";
import Arrangements from "./arrangements";

function Admin() {
  const { data, loading } = useGetAllPiecesQuery();

  function renderPieceAndArrangements() {
    if (data && data.getAllPieces) {
      const name = data.getAllPieces[0]?.name;
      const pieceId = data.getAllPieces[0]?.id;
      return name ? (
        <>
          <div>Using piece {name}</div>
          <div>{pieceId ? <Arrangements pieceId={pieceId} /> : null}</div>
        </>
      ) : (
        <p>You need a piece first!</p>
      );
    }

    return loading ? "Loading Piece" : null;
  }

  // TODO: add in error handling for wrong file types or multiple files.
  return <Section title="Admin">{renderPieceAndArrangements()}</Section>;
}

export default Admin;
