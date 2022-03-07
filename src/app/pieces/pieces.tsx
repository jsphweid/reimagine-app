import { useHistory } from "react-router-dom";

import Section from "../small-components/section";
import { useGetAllPiecesQuery } from "../../generated";
import { usePermissions } from "../../hooks/use-permissions";
import AddNewPiece from "./add-new-piece";

function Pieces() {
  const history = useHistory();
  const { isAdmin } = usePermissions();
  const { data, loading, refetch } = useGetAllPiecesQuery();
  const pieces = data?.getAllPieces || [];

  function renderAdminAddPiece() {
    return isAdmin ? <AddNewPiece onNewPiece={refetch} /> : null;
  }

  return (
    <Section title="Pieces" isLoading={loading}>
      <ul className="reimagine-list reimagine-pieces-list">
        {pieces.map((piece) => (
          <li
            key={`piece${piece.id}`}
            onClick={() => history.push(`/pieces/${piece.id}`)}
          >
            <div>{piece.name}</div>
          </li>
        ))}
      </ul>
      {renderAdminAddPiece()}
    </Section>
  );
}

export default Pieces;
