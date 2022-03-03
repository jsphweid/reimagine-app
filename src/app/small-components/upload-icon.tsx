import { useAuth0 } from "@auth0/auth0-react";
import { useApolloClient } from "@apollo/client";

import { LocalRecording } from "../../types";
import { UploadIcon } from "../../icon";
import { blobToBase64 } from "../../common/helpers";
import {
  GetRecordingsQuery,
  GetRecordingsQueryVariables,
} from "../../generated";
import {
  useCreateRecordingMutation,
  GetRecordingsDocument,
} from "../../generated";
import { useStore } from "../../providers/store";

export interface UploadIconWrapperProps {
  recording: LocalRecording;
  uploadComplete?: () => void;
}

function UploadIconWrapper(props: UploadIconWrapperProps) {
  const { store, setStore } = useStore();
  const [createRec, createRecRes] = useCreateRecordingMutation();
  const client = useApolloClient();
  const { user } = useAuth0();
  const userId = user?.sub as string;

  function handleUpload() {
    blobToBase64(props.recording.blob).then((str) => {
      createRec({
        variables: {
          base64Blob: str,
          segmentId: props.recording.segmentId,
          sampleRate: props.recording.sampleRate,
        },
      }).then((res) => {
        const recording = res.data?.createRecording;
        if (recording) {
          // delete from store
          setStore({
            localRecordings: store.localRecordings.filter(
              (r) => r.dateCreated !== props.recording.dateCreated
            ),
          });

          // add to apollo cache for get query
          client.cache.updateQuery<
            GetRecordingsQuery,
            GetRecordingsQueryVariables
          >(
            { query: GetRecordingsDocument, variables: { userId } },
            (data) => ({
              getRecordingsByUserId: [
                ...(data?.getRecordingsByUserId || []),
                recording,
              ],
            })
          );

          if (props.uploadComplete) {
            props.uploadComplete();
          }
        }
      });
    });
  }
  return <UploadIcon onClick={handleUpload} isLoading={createRecRes.loading} />;
}

export default UploadIconWrapper;
