import { useAuth0 } from "@auth0/auth0-react";

import { LoginButton } from "../../components/buttons/login-button";

function About() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="reimagine-about">
      <p>
        re:imagine explores a new way to make music. Music is the organization
        of sounds. This app is an experimental way of collecting and organizing
        sounds.
      </p>
      <p>Click on the microphone to get started!</p>
      {isAuthenticated ? null : <LoginButton />}
    </div>
  );
}

export default About;
