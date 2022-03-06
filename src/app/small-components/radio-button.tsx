import { RadioSelectedIcon, RadioEmptyIcon } from "../../icon";

export interface RadioProps {
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function RadioButton(props: RadioProps) {
  return (
    <div className="reimagine-radio" onClick={props.onClick}>
      {props.isSelected ? <RadioSelectedIcon /> : <RadioEmptyIcon />}
    </div>
  );
}

export default RadioButton;
