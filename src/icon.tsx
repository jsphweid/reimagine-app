import { IconType } from "react-icons";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";
import * as Io from "react-icons/io";
import * as Ai from "react-icons/ai";
import * as Bi from "react-icons/bi";

interface IconProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: string;
  className?: string;
}

function genIcon(Component: IconType, colorOverride?: string) {
  return (props: IconProps) => {
    const classNames: Set<string> = new Set();
    if (props.isLoading) {
      classNames.add("reimagine-spin");
      classNames.add("reimagine-unclickable");
    }

    if (props.isDisabled) {
      classNames.add("reimagine-unclickable");
    }

    if (props.className) {
      classNames.add(props.className);
    }

    function handleClicked() {
      if (!props.isDisabled && props.onClick) {
        props.onClick();
      }
    }

    return (
      <Component
        color={colorOverride}
        className={Array.from(classNames).join(" ")}
        onClick={handleClicked}
        size={props.size}
      />
    );
  };
}

export const UploadIcon = genIcon(Ai.AiOutlineCloudUpload);
export const BarsIcon = genIcon(Fa.FaBars);
export const CogIcon = genIcon(Fa.FaCog);
export const InfoIcon = genIcon(Fa.FaInfoCircle);
export const MicrophoneIcon = genIcon(Fa.FaMicrophone);
export const ComputerIcon = genIcon(Fa.FaDesktop);
export const HeadphonesIcon = genIcon(Fa.FaHeadphones);
export const EarIcon = genIcon(Md.MdHearing);
export const RecordingIcon = genIcon(Io.IoIosRecording);
export const RecordIcon = genIcon(Fa.FaCircle, "#ea3546");
export const NewIcon = genIcon(Fa.FaRecycle);
export const CheckIcon = genIcon(Fa.FaCheckSquare);
export const EmptyIcon = genIcon(Fa.FaSquareFull);
export const SpinnerIcon = genIcon(Fa.FaSpinner);
export const CloseIcon = genIcon(Fa.FaTimes);
export const PlayIcon = genIcon(Fa.FaPlay);
export const StopIcon = genIcon(Fa.FaStop);
export const ForwardIcon = genIcon(Ai.AiFillStepForward);
export const BackwardsIcon = genIcon(Ai.AiFillStepBackward);
export const RedoIcon = genIcon(Ai.AiOutlineRedo);
export const CabinetIcon = genIcon(Bi.BiCabinet);
export const LogoutIcon = genIcon(Md.MdLogout);
export const LoginIcon = genIcon(Md.MdLogin);
export const WorldIcon = genIcon(Bi.BiWorld);
export const BackIcon = genIcon(Io.IoMdArrowBack);
