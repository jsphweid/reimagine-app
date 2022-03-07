import { BackIcon } from "../../icon";
import { Spinner } from "../../components/spinner";
export interface SectionProps {
  title?: string;
  isLoading?: boolean;
  children: any;
  className?: string;
  onBack?: () => void;
}

function Section(props: SectionProps) {
  const additionalClasses = props.className || "";
  const title = props.title ? <h2>{props.title}</h2> : null;

  return (
    <div className={`reimagine-section ${additionalClasses}`}>
      {props.onBack ? (
        <BackIcon
          className="reimagine-section-backArrow"
          onClick={props.onBack}
        />
      ) : null}
      <div className="reimagine-section-textContainer">{title}</div>
      {props.isLoading ? <Spinner /> : props.children}
    </div>
  );
}

export default Section;
