import {
  FaSpinner as SpinnerIcon,
  FaUpload as UploadIcon,
} from "react-icons/fa";

import { AnyRecording } from "../../types";

export interface UploadIconWrapperProps {
  recording: AnyRecording;
  isRecording?: boolean;
}

function UploadIconWrapper(props: UploadIconWrapperProps) {
  if (!props.recording) {
    return <UploadIcon className="reimagine-unclickable" />;
  }

  return <SpinnerIcon className="reimagine-unclickable" />;

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
