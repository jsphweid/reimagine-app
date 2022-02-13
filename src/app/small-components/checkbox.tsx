import React from "react";
import {
  FaCheckSquare as CheckIcon,
  FaSquareFull as EmptyIcon, // TODO: don't know if this icon is correct
} from "react-icons/fa";

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
