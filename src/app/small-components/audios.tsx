import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { timeSince } from "../../common/helpers";
import PlayIconWrapper from "../small-components/play-icon";
import { prettyPrintDuration } from "../../utils";
import { LoginButton } from "src/components/buttons/login-button";

interface AudioItem {
  url: string;
  dateCreated: Date | string;
  duration: number;
  name?: string;

  // I don't really like this but it's the easiest thing to do for now
  uploadIcon?: JSX.Element;
  createMixFromRecordingId?: string;
}

interface AudiosProps {
  items: AudioItem[];
}

function Audios(props: AudiosProps) {
  const history = useHistory();
  const { isAuthenticated } = useAuth0();

  function renderRecordingItem(item: AudioItem) {
    const name = item.name || "[Untitled]";
    const date = new Date(item.dateCreated).getTime();
    const key = `${date}`;
    return (
      <li key={key}>
        <div className="reimagine-audios-item-text">
          {name}
          <br />
          Created {timeSince(date)}
          <br />
          {prettyPrintDuration(item.duration)}
        </div>
        <div className="reimagine-audios-item-icons">
          {item.createMixFromRecordingId && isAuthenticated ? (
            <button
              className="reimagine-audios-startMix"
              onClick={() =>
                history.push(
                  `/create-mix?recordingId=${item.createMixFromRecordingId}`
                )
              }
            >
              mix
            </button>
          ) : null}
          {item.uploadIcon || null}
          <PlayIconWrapper url={item.url} />
        </div>
      </li>
    );
  }

  const items = props.items.map(renderRecordingItem);
  return (
    <div className="reimagine-audios">
      {items.length ? (
        <ul className="reimagine-list">{items}</ul>
      ) : (
        <div className="reimagine-list-empty">Couldn't find anything...</div>
      )}
      {isAuthenticated ? null : (
        <p className="reimagine-audios-notLoggedIn">
          Keep in mind that since you're not logged in, your history is reduced
          to a single session and you won't be able to create custom mixes...
          For a better app experience, login!
          <br />
          <br />
          <LoginButton />
        </p>
      )}
    </div>
  );
}

export default Audios;
