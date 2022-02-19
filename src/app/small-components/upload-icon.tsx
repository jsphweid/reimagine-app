import { AnyRecording } from "../../types";
import { SpinnerIcon, UploadIcon } from "../../icon";

export interface UploadIconWrapperProps {
  recording: AnyRecording;
  isRecording?: boolean;
}

function UploadIconWrapper(props: UploadIconWrapperProps) {
  if (!props.recording) {
    return <UploadIcon isDisabled />;
  }

  return <SpinnerIcon isDisabled />;

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
