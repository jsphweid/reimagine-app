import { useHistory, useParams } from "react-router-dom";

import Section from "../small-components/section";
import { useGetArrangementQuery } from "../../generated";
import { Spinner } from "../../components/spinner";
import Audios from "../small-components/audios";

function Arrangement() {
  const history = useHistory();
  const { arrangementId } = useParams<{ arrangementId: string }>();
  const arrangementQuery = useGetArrangementQuery({
    variables: { arrangementId },
  });
  const arrangement = arrangementQuery.data?.getArrangementById;

  if (arrangementQuery.loading) {
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
          <p>No mixes yet for this piece.</p>
        )}
      </ul>
    );
  }

  return (
    <Section
      title={arrangement?.name || "Arrangement"}
      onBack={() => history.push("/pieces")}
    >
      {renderContent()}
    </Section>
  );
}

export default Arrangement;
