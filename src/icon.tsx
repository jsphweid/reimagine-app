import { IconType } from "react-icons";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";
import * as Io from "react-icons/io";

interface IconProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

function genIcon(Component: IconType) {
  return (props: IconProps) => {
    const classNames: Set<string> = new Set();
    if (props.isLoading) {
      classNames.add("reimagine-spin");
      classNames.add("reimagine-unclickable");
    }

    if (props.isDisabled) {
      classNames.add("reimagine-unclickable");
    }

    return (
      <Component
        className={Array.from(classNames).join(" ")}
        onClick={props.onClick}
      />
    );
  };
}

export const UploadIcon = genIcon(Fa.FaUpload);
export const BarsIcon = genIcon(Fa.FaBars);
export const CogIcon = genIcon(Fa.FaCog);
export const InfoIcon = genIcon(Fa.FaInfoCircle);
export const MicrophoneIcon = genIcon(Fa.FaMicrophone);
export const ComputerIcon = genIcon(Fa.FaDesktop);
export const HeadphonesIcon = genIcon(Fa.FaHeadphones);
export const EarIcon = genIcon(Md.MdHearing);
export const RecordingIcon = genIcon(Io.IoIosRecording);
export const RecordIcon = genIcon(Fa.FaCircle);
export const NewIcon = genIcon(Fa.FaRecycle);
export const CheckIcon = genIcon(Fa.FaCheckSquare);
export const EmptyIcon = genIcon(Fa.FaSquareFull);
export const SpinnerIcon = genIcon(Fa.FaSpinner);
export const CloseIcon = genIcon(Fa.FaTimes);
export const PlayIcon = genIcon(Fa.FaPlay);
export const StopIcon = genIcon(Fa.FaStop);
