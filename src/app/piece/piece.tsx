import { useHistory, useParams } from "react-router-dom";

import Section from "../small-components/section";
import { useGetPieceQuery } from "../../generated";
import { Spinner } from "../../components/spinner";
import { usePermissions } from "../../hooks/use-permissions";
import AddNewArrangement from "./add-new-arrangement";

function Piece() {
  const history = useHistory();
  const { isAdmin } = usePermissions();
  const { pieceId } = useParams<{ pieceId: string }>();
  const pieceQuery = useGetPieceQuery({ variables: { pieceId } });
  const piece = pieceQuery.data?.getPieceById;
  const arrangements = pieceQuery.data?.getPieceById?.arrangements || [];

  if (pieceQuery.loading) {
    return <Spinner />;
  }

  function renderUpload() {
    return isAdmin ? (
      <AddNewArrangement
        onNewArrangement={pieceQuery.refetch}
        pieceId={pieceId}
      />
    ) : null;
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
          <p className="reimagine-pieces-missing">
            No arrangements yet for this piece. In the future, I may allow
            others to create arrangements, but for now I'm only allowing myself
            to do this.
          </p>
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
      {renderUpload()}
    </Section>
  );
}

export default Piece;
