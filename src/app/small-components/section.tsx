import { BackIcon } from "../../icon";
export interface SectionProps {
  title?: string;
  children: any;
  className?: string;
  onBack?: () => void;
}

function Section(props: SectionProps) {
  const additionalClasses = props.className || "";
  const title = props.title ? <h2>{props.title}</h2> : null;

  return (
    <div className={`reimagine-section ${additionalClasses}`}>
      {props.onBack ? <BackIcon onClick={props.onBack} /> : null}
      {title}
      {props.children}
    </div>
  );
}

export default Section;
