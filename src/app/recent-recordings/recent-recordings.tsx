import * as React from 'react'
import { withSiteData } from 'react-static'
import { connect } from 'react-redux'
import { StoreType } from '../../connectors/redux/reducers'
import { RecordingType } from '../../common/types'
import { timeSince } from '../../common/helpers'

import UploadIconWrapper from '../small-components/upload-icon'
import PlayIconWrapper from '../small-components/play-icon'
import Section from '../small-components/section'

export interface RecentRecordingsProps {
  dispatch: any
  recordings: RecordingType[]
  isPlaying: boolean
}

export class RecentRecordings extends React.Component<RecentRecordingsProps> {
  constructor(props: RecentRecordingsProps) {
    super(props)
  }

  private renderRecordingItem(recording: RecordingType): JSX.Element {
    const name = recording.segment.humanHash || '[Untitled]'
    const date = new Date(recording.recordingDate).getTime()
    return (
      <li key={recording.recordingDate}>
        <div className="reimagine-recentRecordings-item-text">
          {name}
          <br />
          {timeSince(date)}
        </div>
        <div className="reimagine-recentRecordings-item-icons">
          <PlayIconWrapper recording={recording} />
          <UploadIconWrapper recording={recording} />
        </div>
      </li>
    )
  }

  public render() {
    const { recordings } = this.props
    const recordingItems = recordings
      .map(recording => this.renderRecordingItem(recording))
      .reverse()

    const content = recordings.length ? (
      <ul>{recordingItems}</ul>
    ) : (
      <p>You haven't made any recordings yet.</p>
    )
    return (
      <Section className="reimagine-recentRecordings" title="Recent Recordings">
        {content}
      </Section>
    )
  }
}

const mapStateToProps = (
  store: StoreType,
  ownProp?: any
): RecentRecordingsProps => ({
  dispatch: ownProp.dispatch,
  recordings: store.recording.recordings,
  isPlaying: store.general.isPlaying
})

export default withSiteData(connect(mapStateToProps)(RecentRecordings))
