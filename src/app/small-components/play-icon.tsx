import React from "react";
import { FaPlay as PlayIcon, FaStop as StopIcon } from "react-icons/fa";

import {
  Recording,
  PlaySessionConfig,
  AudioEvent,
  AudioSessionConfig,
} from "../../common/types";
import AudioEngine from "../../audio-engine";
import { base64ToBlob } from "../../common/helpers";

export interface PlayIconWrapperProps {
  recording: Recording;
  isPlaying?: boolean; // TODO: wasn't optional
  // settings?: SettingsStoreStateType; // TODO: wasn't optional
  activeAudioElement?: HTMLAudioElement; // TODO: wasn't optional
}

class PlayIconWrapper extends React.Component<PlayIconWrapperProps> {
  private static playStopper: NodeJS.Timer | null;
  constructor(props: PlayIconWrapperProps) {
    super(props);
  }

  componentWillReceiveProps(nextProps: PlayIconWrapperProps) {
    if (
      nextProps.activeAudioElement &&
      this.props.activeAudioElement &&
      nextProps.activeAudioElement !== this.props.activeAudioElement
    ) {
      this.props.activeAudioElement.pause();
    }
  }

  private handleStopButtonClicked() {
    const { activeAudioElement } = this.props;
    AudioEngine.stopRecording();
    // dispatch(removeActiveAudioConfig());
    // dispatch(stopPlayingAudioElement());
    if (activeAudioElement) {
      activeAudioElement.pause();
    }

    if (PlayIconWrapper.playStopper) {
      clearTimeout(PlayIconWrapper.playStopper);
      PlayIconWrapper.playStopper = null;
    }
  }

  private handlePlayButtonClicked() {
    const { recording } = this.props;

    base64ToBlob(recording.base64Blob).then((blob: Blob) => {
      // TODO: used to come from config
      const { playNotes, playMetronome } = {
        playNotes: true,
        playMetronome: true,
      };
      // settings.playRecordConfigs.playRecordingConfig;
      const config: PlaySessionConfig = {
        playNotes,
        playMetronome,
        type: AudioEvent.Playing,
        recordingDate: recording.recordingDate,
        startTime: AudioEngine.audioContext.currentTime,
        segment: recording.segment,
      };
      const blobUrl = URL.createObjectURL(blob);
      const audioElement = new Audio(blobUrl);
      AudioEngine.startPlaying(config);
      audioElement.play();
      const duration = (config.segment.midiJson.duration + 0.5) * 1000;
      PlayIconWrapper.playStopper = setTimeout(() => {
        this.handleStopButtonClicked();
      }, duration);

      // dispatch(setAudioElement(audioElement));
      // dispatch(setActiveAudioConfig(config));
    });
  }

  public render() {
    return this.props.isPlaying ? (
      <StopIcon onClick={this.handleStopButtonClicked.bind(this)} />
    ) : (
      <PlayIcon onClick={this.handlePlayButtonClicked.bind(this)} />
    );
  }
}

function determineIfIsPlaying(
  activeAudioConfig: AudioSessionConfig,
  recording: Recording
): boolean {
  return (
    !!activeAudioConfig &&
    !!recording &&
    !!activeAudioConfig.recordingDate &&
    activeAudioConfig.recordingDate === recording.recordingDate
  );
}

export default PlayIconWrapper;
