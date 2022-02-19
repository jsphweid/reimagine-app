import { LocalRecording } from "../../types";
import { UploadIcon } from "../../icon";
import { blobToBase64 } from "../../common/helpers";
import { useCreateRecordingMutation } from "../../generated";

export interface UploadIconWrapperProps {
  recording: LocalRecording;
}

function UploadIconWrapper(props: UploadIconWrapperProps) {
  const [createRec, createRecRes] = useCreateRecordingMutation();

  function handleUpload() {
    blobToBase64(props.recording.blob).then((str) => {
      createRec({
        variables: {
          base64Blob: str,
          segmentId: props.recording.segmentId,
          sampleRate: props.recording.sampleRate,
        },
      }).then((res) => {
        if (res.data?.createRecording) {
          console.log("success", res);
          // delete from store and add to apollo cache?
        }
      });
    });
  }
  return <UploadIcon onClick={handleUpload} />;

  // const { uploadState } = recording;
  // const clickHandler =
  //   uploadState === CanUpload
  //     ? () => null // TODO: fix
  //     : undefined;
  // const isBusy = uploadState === Uploaded || isRecording;
  // return uploadState === Uploading ? (
  //   <SpinnerIcon className="reimagine-spin" />
  // ) : (
  //   <UploadIcon
  //     className={isBusy ? "reimagine-unclickable" : ""}
  //     onClick={clickHandler}
  //   />
  // );
}

export default UploadIconWrapper;
