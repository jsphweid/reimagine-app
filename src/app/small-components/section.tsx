import * as React from 'react'

export interface SectionProps {
  title?: string
  children: any
  className?: string
}

const Section: React.SFC<SectionProps> = (props): JSX.Element => {
  const additionalClasses = props.className || ''
  const title = props.title ? <h2>{props.title}</h2> : null
  return (
    <div className={`reimagine-section ${additionalClasses}`}>
      {title}
      {props.children}
    </div>
  )
}

export default Section
