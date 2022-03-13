import { useAuth0 } from "@auth0/auth0-react";
import { useApolloClient } from "@apollo/client";

import { LocalRecording } from "../../types";
import { UploadIcon } from "../../icon";
import { blobToBase64 } from "../../common/helpers";
import { useStore } from "../../providers/store";
import {
  GetRecordingsQuery,
  GetRecordingsQueryVariables,
  Recording,
  useCreateRecordingMutation,
  GetRecordingsDocument,
} from "../../generated";

export interface UploadIconWrapperProps {
  recording: LocalRecording;
  uploadComplete?: (recording: Recording) => void;
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
            recentlyUploaded: [...store.recentlyUploaded, recording.id],
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
            props.uploadComplete(recording);
          }
        }
      });
    });
  }
  return <UploadIcon onClick={handleUpload} isLoading={createRecRes.loading} />;
}

export default UploadIconWrapper;
