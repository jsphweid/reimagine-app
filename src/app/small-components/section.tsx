import React from "react";

export interface SectionProps {
  title?: string;
  children: any;
  className?: string;
}

function Section(props: SectionProps) {
  const additionalClasses = props.className || "";
  const title = props.title ? <h2>{props.title}</h2> : null;
  return (
    <div className={`reimagine-section ${additionalClasses}`}>
      {title}
      {props.children}
    </div>
  );
}

export default Section;
