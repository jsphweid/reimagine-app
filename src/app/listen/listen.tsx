import Section from "../small-components/section";
import { useGetMixesWithMeQuery, Mix } from "../../generated";
import Audios from "../small-components/audios";
import { Spinner } from "../../components/spinner";

function Listen() {
  const { data, loading } = useGetMixesWithMeQuery();
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
