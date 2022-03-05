import { useHistory, useParams } from "react-router-dom";

import Section from "../small-components/section";
import { useGetPieceQuery } from "../../generated";
import { Spinner } from "../../components/spinner";

function Piece() {
  const history = useHistory();
  const { pieceId } = useParams<{ pieceId: string }>();
  const pieceQuery = useGetPieceQuery({ variables: { pieceId } });
  const piece = pieceQuery.data?.getPieceById;
  const arrangements = pieceQuery.data?.getPieceById?.arrangements || [];

  if (pieceQuery.loading) {
    return <Spinner />;
  }

  function renderContent() {
    if (!piece) {
      return <p>This piece doesn't exist!</p>;
    }
    return (
      <ul className="reimagine-list reimagine-pieces-list">
        {arrangements.length ? (
          arrangements.map((arr) => (
            <li
              key={`arr${arr.id}`}
              onClick={() => history.push(`/arrangements/${arr.id}`)}
            >
              <div>{arr.name}</div>
            </li>
          ))
        ) : (
          <p>No arrangements yet for this piece.</p>
        )}
      </ul>
    );
  }

  return (
    <Section
      title={piece?.name || "Piece"}
      onBack={() => history.push("/pieces")}
    >
      {renderContent()}
    </Section>
  );
}

export default Piece;
