import { useAuth0 } from "@auth0/auth0-react";

import {
  GetUserSettingsDocument,
  useGetUserSettingsQuery,
  UserSettings,
  useUpdateUserSettingsMutation,
} from "../../generated";
import Checkbox from "../small-components/checkbox";
import Section from "../small-components/section";
import { removeTypename } from "../../utils";

function Settings() {
  const { user } = useAuth0();

  const userId = user?.sub as string;

  const { data, loading: isLoading } = useGetUserSettingsQuery({
    variables: { userId: userId },
  });
  const [update, { data: updatedSettings }] = useUpdateUserSettingsMutation();

  const userSettings =
    updatedSettings?.updateUserSettings ||
    data?.getUserSettingsByUserId ||
    null;

  if (!userSettings || isLoading) {
    return <>loading</>;
  }

  function handleFlagUpdated(flag: keyof UserSettings) {
    const newVal = !userSettings![flag];
    const input = { ...removeTypename(userSettings!), [flag]: newVal };
    update({
      variables: {
        userId,
        input,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateUserSettings: { ...input, __typename: "UserSettings" },
      },
      update: (store, { data }) => {
        store.writeQuery({
          query: GetUserSettingsDocument,
          variables: { userId },
          data: {
            __typename: "Mutation",
            getUserSettingsByUserId: data?.updateUserSettings,
          },
        });
      },
    });
  }

  function renderCheckbox(flag: keyof UserSettings) {
    return (
      <Checkbox
        onClick={() => handleFlagUpdated(flag)}
        isChecked={userSettings ? userSettings[flag] === true : false}
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
