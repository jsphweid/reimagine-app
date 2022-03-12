import { NavLink, useHistory, useParams } from "react-router-dom";

import Section from "../small-components/section";
import {
  useGetArrangementQuery,
  useGetSegmentsLazyQuery,
} from "../../generated";
import { Spinner } from "../../components/spinner";
import Audios from "../small-components/audios";
import { useStore } from "../../providers/store";

function Arrangement() {
  const history = useHistory();
  const { setStore } = useStore();
  const { arrangementId } = useParams<{ arrangementId: string }>();
  const arrangementQuery = useGetArrangementQuery({
    variables: { arrangementId },
  });
  const [getSegments, { loading: loadingSegments }] = useGetSegmentsLazyQuery();
  const arrangement = arrangementQuery.data?.getArrangementById;

  if (arrangementQuery.loading || loadingSegments) {
    return <Spinner />;
  }

  function renderContent() {
    if (!arrangement) {
      return <p>This arrangement doesn't exist!</p>;
    }
    return (
      <ul className="reimagine-list reimagine-pieces-list">
        {arrangement.mixes?.length ? (
          <Audios items={arrangement.mixes} />
        ) : (
          <p className="reimagine-pieces-message">
            No mixes yet for this piece. Maybe try recording some of your own
            parts and then <NavLink to="/my-recordings">make a mix</NavLink> out
            of them!
          </p>
        )}
      </ul>
    );
  }

  function handleRecordIt() {
    setStore({ segments: [], segmentIndex: 0 });
    getSegments({ variables: { arrangementId } }).then(({ data }) => {
      const segments = data?.getSegmentsByArrangementId!;
      console.log("setting segments", segments);
      setStore({ segments });
      history.push(`/recording`);
    });
  }

  function renderRecordIt() {
    return (
      <div className="reimagine-arrangement-recordIt">
        <button onClick={handleRecordIt}>Record it!</button>
      </div>
    );
  }

  return (
    <Section
      title={arrangement?.name || "Arrangement"}
      onBack={() =>
        history.push(arrangement ? `/pieces/${arrangement.pieceId}` : "/pieces")
      }
    >
      {renderContent()}
      {renderRecordIt()}
    </Section>
  );
}

export default Arrangement;
