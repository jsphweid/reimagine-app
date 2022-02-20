import { timeSince } from "../../common/helpers";
import PlayIconWrapper from "../small-components/play-icon";

interface AudioItem {
  url: string;
  dateCreated: Date | string;
  name?: string;

  // I don't really like this but it's the easiest thing to do for now
  uploadIcon?: JSX.Element;
}

interface AudiosProps {
  items: AudioItem[];
}

function Audios(props: AudiosProps) {
  function renderRecordingItem(item: AudioItem) {
    const name = item.name || "[Untitled]";
    const date = new Date(item.dateCreated).getTime();
    const key = `${date}`;
    return (
      <li key={key}>
        <div className="reimagine-audios-item-text">
          {name}
          <br />
          {timeSince(date)}
        </div>
        <div className="reimagine-audios-item-icons">
          {item.uploadIcon || null}
          <PlayIconWrapper url={item.url} />
        </div>
      </li>
    );
  }

  const items = props.items.map(renderRecordingItem);
  return (
    <div className="reimagine-audios">
      {items.length ? <ul>{items}</ul> : <p>I got nothing...</p>}
    </div>
  );
}

export default Audios;
