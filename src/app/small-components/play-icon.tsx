import React from "react";
import { FaPlay as PlayIcon, FaStop as StopIcon } from "react-icons/fa";

import { base64ToBlob } from "../../common/helpers";
import { AudioSessionConfig } from "../../audio-engine";
import { Recording } from "../../generated";

export interface PlayIconWrapperProps {
  recording: Recording;
  isPlaying?: boolean; // TODO: wasn't optional
  // settings?: SettingsStoreStateType; // TODO: wasn't optional
  activeAudioElement?: HTMLAudioElement; // TODO: wasn't optional
}

function PlayIconWrapper(props: PlayIconWrapperProps) {
  return props.isPlaying ? <StopIcon /> : <PlayIcon />;
}

// class PlayIconWrapper extends React.Component<PlayIconWrapperProps> {
//   componentWillReceiveProps(nextProps: PlayIconWrapperProps) {
//     if (
//       nextProps.activeAudioElement &&
//       this.props.activeAudioElement &&
//       nextProps.activeAudioElement !== this.props.activeAudioElement
//     ) {
//       this.props.activeAudioElement.pause();
//     }
//   }

//   private handleStopButtonClicked() {
//     const { activeAudioElement } = this.props;
//     AudioEngine.stopRecording();
//     // dispatch(removeActiveAudioConfig());
//     // dispatch(stopPlayingAudioElement());
//     if (activeAudioElement) {
//       activeAudioElement.pause();
//     }

//     if (PlayIconWrapper.playStopper) {
//       clearTimeout(PlayIconWrapper.playStopper);
//       PlayIconWrapper.playStopper = null;
//     }
//   }

//   private handlePlayButtonClicked() {
//     const { recording } = this.props;

//     // TODO: should be `base64Blob`
//     base64ToBlob(recording.id).then((blob: Blob) => {
//       // TODO: used to come from config
//       const { playNotes, playMetronome } = {
//         playNotes: true,
//         playMetronome: true,
//       };
//       // settings.playRecordConfigs.playRecordingConfig;
//       const config: AudioSessionConfig = {
//         playNotes,
//         playMetronome,
//         recordingDate: recording.dateCreated,
//         startTime: AudioEngine.audioContext.currentTime,
//       };
//       const blobUrl = URL.createObjectURL(blob);
//       const audioElement = new Audio(blobUrl);
//       AudioEngine.startPlaying(config);
//       audioElement.play();
//       // TODO: reenable this
//       // const duration = (config.segment.midiJson.duration + 0.5) * 1000;
//       // PlayIconWrapper.playStopper = setTimeout(() => {
//       //   this.handleStopButtonClicked();
//       // }, duration);

//       // dispatch(setAudioElement(audioElement));
//       // dispatch(setActiveAudioConfig(config));
//     });
//   }

//   public render() {
//     return this.props.isPlaying ? (
//       <StopIcon onClick={this.handleStopButtonClicked.bind(this)} />
//     ) : (
//       <PlayIcon onClick={this.handlePlayButtonClicked.bind(this)} />
//     );
//   }
// }

// function determineIfIsPlaying(
//   activeAudioConfig: AudioSessionConfig,
//   recording: Recording
// ): boolean {
//   return (
//     !!activeAudioConfig &&
//     !!recording &&
//     !!activeAudioConfig.recordingDate &&
//     activeAudioConfig.recordingDate === recording.dateCreated
//   );
// }

export default PlayIconWrapper;
