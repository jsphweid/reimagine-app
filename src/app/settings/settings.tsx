import React from "react";

import Checkbox from "../small-components/checkbox";
import Section from "../small-components/section";
import { PlayRecordFlags, useStore } from "../../store";

function Settings() {
  const { store, setStore } = useStore();

  function handleFlagUpdated(flag: keyof PlayRecordFlags, val: boolean) {
    setStore({ [flag]: val });
    // TODO: update remote silently
  }

  function renderCheckbox(flag: keyof PlayRecordFlags) {
    const newValue = !store[flag];
    return (
      <Checkbox
        onClick={() => handleFlagUpdated(flag, newValue)}
        isChecked={!!store[flag]}
      />
    );
  }

  return (
    <Section className="reimagine-settings" title="Settings">
      <div className="remagine-settings-form">
        <div className="reimagine-settings-form-playRecordConfigs">
          Customize what you want to hear when interacting.
          <table>
            <thead>
              <tr>
                <td />
                <td>Metronome</td>
                <td>Notes</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Play Segment</td>
                <td>{renderCheckbox("metronomeOnSegmentPlay")}</td>
                <td>{renderCheckbox("notesOnSegmentPlay")}</td>
              </tr>
              <tr>
                <td>Record Segment</td>
                <td>{renderCheckbox("metronomeOnRecord")}</td>
                <td>{renderCheckbox("notesOnRecord")}</td>
              </tr>
              <tr>
                <td>Play Recording</td>
                <td>{renderCheckbox("metronomeOnRecordingPlay")}</td>
                <td>{renderCheckbox("notesOnRecordingPlay")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="reimagine-settings-identity">
        <p>TODO: add back in identity</p>
      </div>
    </Section>
  );
}

export default Settings;
