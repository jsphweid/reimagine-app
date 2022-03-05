import { useHistory } from "react-router-dom";

import Section from "../small-components/section";
import { useGetAllPiecesQuery } from "../../generated";
import { Spinner } from "../../components/spinner";

function Pieces() {
  const history = useHistory();
  const { data, loading } = useGetAllPiecesQuery();
  const pieces = data?.getAllPieces;

  if (loading) {
    return <Spinner />;
  }

  if (!pieces) {
    return null;
  }

  return (
    <Section title="Pieces">
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
    </Section>
  );
}

export default Pieces;
