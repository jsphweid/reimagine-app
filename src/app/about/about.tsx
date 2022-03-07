import { useAuth0 } from "@auth0/auth0-react";

import { LoginButton } from "../../components/buttons/login-button";

function About() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="reimagine-about">
      <p>
        <b>carryoaky</b> explores a new way to make music. Music is the
        organization of sounds. This app is an experimental way of collecting
        and organizing sounds.
      </p>
      <p>
        Click on the microphone to get started! Also, you'll have a better
        experience if you're logged in, but it's not strictly necessary.
      </p>
      {isAuthenticated ? null : <LoginButton />}

      <h2>How it works</h2>
      <p>
        The app manages a database of musical <b>pieces</b>, each of which can
        have multiple <b>arrangements</b>. An arrangement is like a specific
        implementation of a piece. Maybe it's a song arranged for acapella
        performance. Or perhaps it's a more esoteric take on the piece that is
        meant to be an instrumental. At the end of the day, an arrangement is
        just a bunch of midi segments. These segments are just the "notes on the
        paper" and the app solicits YOU to perform them. When you record your
        audio in the app, you're <b>recording</b> is against a specific segment
        which is part of a specific arrangement. Those recordings can be later
        stiched together (i.e. <b>mixed</b>) to construct something that
        (hopefully) sounds like the original arrangement/piece!
      </p>
    </div>
  );
}

export default About;
