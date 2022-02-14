import Section from "../small-components/section";
import { useGetAllPiecesQuery } from "../../generated";
import Arrangements from "./arrangements";

function Admin() {
  const { data, loading } = useGetAllPiecesQuery();

  function renderPieceAndArrangements() {
    if (data && data.getAllPieces) {
      const name = data.getAllPieces[0]?.name;
      const pieceId = data.getAllPieces[0]?.id;
      return (
        <>
          <div>Using piece {name}</div>
          <div>{pieceId ? <Arrangements pieceId={pieceId} /> : null}</div>
        </>
      );
    }

    return loading ? "Loading Piece" : null;
  }

  // TODO: add in error handling for wrong file types or multiple files.
  return <Section>{renderPieceAndArrangements()}</Section>;
}

export default Admin;
