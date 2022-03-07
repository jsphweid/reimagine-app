import { useAuth0 } from "@auth0/auth0-react";
import { useApolloClient } from "@apollo/client";

import Checkbox from "../small-components/checkbox";
import Section from "../small-components/section";
import { removeTypename } from "../../utils";
import { LoginButton } from "../../components/buttons/login-button";
import {
  useGetMySettingsQuery,
  GetMySettingsDocument,
  UserSettings,
  useUpdateUserSettingsMutation,
} from "../../generated";

function Settings() {
  const { user, isAuthenticated } = useAuth0();
  const client = useApolloClient();

  const userId = user?.sub as string;

  const { data, loading: isLoading } = useGetMySettingsQuery();
  const [update, { data: updatedSettings }] = useUpdateUserSettingsMutation();

  const userSettings =
    updatedSettings?.updateUserSettings || data?.getMyUserSettings || null;

  function handleFlagUpdated(flag: keyof UserSettings) {
    const newVal = !userSettings![flag];
    const updates = { ...userSettings, [flag]: newVal };

    if (isAuthenticated) {
      update({
        variables: {
          userId,
          input: removeTypename(updates),
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateUserSettings: {
            ...removeTypename(updates),
            __typename: "UserSettings",
          },
        },
        update: (store, { data }) => {
          store.writeQuery({
            query: GetMySettingsDocument,
            data: {
              __typename: "Mutation",
              getMyUserSettings: data?.updateUserSettings,
            },
          });
        },
      });
    } else {
      // although they are not logged in, as far as "their" settings are concerned, they are
      client.writeQuery({
        query: GetMySettingsDocument,
        data: {
          __typename: "Mutation",
          getMyUserSettings: updates,
        },
      });
    }
  }

  function renderCheckbox(flag: keyof UserSettings) {
    return (
      <Checkbox
        onClick={() => handleFlagUpdated(flag)}
        isChecked={userSettings ? userSettings[flag] === true : false}
      />
    );
  }

  const warning = isAuthenticated
    ? null
    : "NOTE: since you're not logged in, these settings will only apply to this current session... Once you refresh the page, they'll reset to defaults!";

  return (
    <Section
      className="reimagine-settings"
      title="Settings"
      isLoading={!userSettings || isLoading}
    >
      <div className="remagine-settings-form">
        <div className="reimagine-settings-form-playRecordConfigs">
          <p>Customize what you want to hear when interacting.</p>
          <p>{warning}</p>
          {isAuthenticated ? null : <LoginButton />}
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
    </Section>
  );
}

export default Settings;
