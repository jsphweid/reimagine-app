import * as React from 'react'
import CheckIcon from 'react-icons/lib/fa/check-square'
import EmptyIcon from 'react-icons/lib/fa/square-o'

export interface CheckboxProps {
	isChecked: boolean
	onClick: () => void
}

const Checkbox: React.SFC<CheckboxProps> = (props): JSX.Element => {
	return (
		<div className="reimagine-checkbox" onClick={props.onClick}>
			{props.isChecked ? <CheckIcon /> : <EmptyIcon />}
		</div>
	)
}

export default Checkbox
