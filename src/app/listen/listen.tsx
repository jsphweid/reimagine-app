import { NavLink } from "react-router-dom";

import Section from "../small-components/section";
import { useGetMixesWithMeQuery, Mix } from "../../generated";
import Audios from "../small-components/audios";
import { Spinner } from "../../components/spinner";

function Listen() {
  const { data, loading } = useGetMixesWithMeQuery({ fetchPolicy: "no-cache" });
  const mixes = data?.getMixesWithMe || [];

  function makeName(mix: Mix) {
    const arrName = mix.arrangement?.name || "some arrangement";
    const pieceName = mix.arrangement?.piece?.name || "Untitled";
    return `${pieceName} (${arrName})`;
  }

  return (
    <Section title="My Mixes">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Audios
            items={mixes.map((m) => ({
              ...m,
              name: makeName(m as Mix),
            }))}
          />
          <p>
            To make your own mixes, go to{" "}
            <NavLink to="/my-recordings">My Recordings</NavLink> and select a
            recording to get started.
          </p>
        </>
      )}
    </Section>
  );
}

export default Listen;
