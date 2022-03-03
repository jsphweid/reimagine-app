import { useAuth0 } from "@auth0/auth0-react";

import Section from "../small-components/section";
import { useGetMixesWithMeQuery, Mix } from "../../generated";
import Audios from "../small-components/audios";
import { Spinner } from "../../components/spinner";

function Listen() {
  const { user } = useAuth0();
  const userId = user?.sub as string;
  const { data, loading } = useGetMixesWithMeQuery({ variables: { userId } });
  const mixes = data?.getMixesByUserId || [];

  function makeName(mix: Mix) {
    const arrName = mix.arrangement?.name || "some arrangement";
    const pieceName = mix.arrangement?.piece?.name || "Untitled";
    return `${pieceName} (${arrName})`;
  }

  return (
    <Section title="Listen">
      {loading ? (
        <Spinner />
      ) : (
        <Audios
          items={mixes.map((m) => ({
            ...m,
            name: makeName(m as Mix),
          }))}
        />
      )}
    </Section>
  );
}

export default Listen;
