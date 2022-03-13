import { useState } from "react";

import { Recording } from "../../generated";
import { timeSince } from "../../common/helpers";
import Checkbox from "../small-components/checkbox";
import PlayIconWrapper from "../small-components/play-icon";
import { MinimalSegment } from "./create-mix";
import RadioButton from "../small-components/radio-button";
import { Link } from "react-router-dom";

interface RecordingSelectionProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  segment: MinimalSegment;
  recordings: Recording[];
}

function RecordingSelection(props: RecordingSelectionProps) {
  const [collapsed, setCollapsed] = useState(!!props.selected);
  const name = `Segment ${props.segment.id.slice(0, 4)}`;
  const record = (
    <span>
      {" "}
      <Link to={`/recording?segmentId=${props.segment.id}`}>
        (record{props.recordings.length ? " again" : ""})
      </Link>
    </span>
  );

  return (
    <div className="reimagine-segment">
      <div className="reimagine-segment-segment">
        <div>
          {name}
          {record}
        </div>
        <div className="reimagine-segment-checkbox">
          {props.selected ? (
            <Checkbox
              isChecked
              onClick={() => {
                props.onSelect(null);
                setCollapsed(false);
              }}
            />
          ) : null}
        </div>
      </div>
      <ul
        className="reimagine-segment-content"
        style={{ maxHeight: collapsed ? undefined : "400px" }}
      >
        {props.recordings.map((recording) => (
          <li key={recording.id}>
            <div>
              Created {timeSince(new Date(recording.dateCreated).getTime())}
            </div>

            <PlayIconWrapper url={recording.url} />

            {props.selected === recording.id ? (
              <RadioButton isSelected onClick={() => props.onSelect(null)} />
            ) : (
              <RadioButton
                onClick={() => {
                  setCollapsed(true);
                  props.onSelect(recording.id);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecordingSelection;
