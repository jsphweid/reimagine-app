import React from "react";
import { Recording } from "src/generated";
import {
  FaSpinner as SpinnerIcon,
  FaUpload as UploadIcon,
} from "react-icons/fa";

export interface UploadIconWrapperProps {
  recording: Recording | null;
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
