import { useAuth0 } from "@auth0/auth0-react";

import Section from "../small-components/section";
import { useGetMixesWithMeQuery } from "../../generated";
import Audios from "../small-components/audios";

function Listen() {
  const { user } = useAuth0();
  const userId = user?.sub as string;
  const mixesWithMe = useGetMixesWithMeQuery({ variables: { userId } });
  const mixes = mixesWithMe.data?.getMixesByUserId || [];
  return (
    <Section title="Listen">
      <Audios
        items={mixes.map((m) => ({
          ...m,
          name: m.arrangement?.name || "untitled",
        }))}
      />
    </Section>
  );
}

export default Listen;
