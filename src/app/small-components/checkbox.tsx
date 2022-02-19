import { CheckIcon, EmptyIcon } from "../../icon";
export interface CheckboxProps {
  isChecked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function Checkbox(props: CheckboxProps) {
  return (
    <div className="reimagine-checkbox" onClick={props.onClick}>
      {props.isChecked ? <CheckIcon /> : <EmptyIcon />}
    </div>
  );
}

export default Checkbox;
