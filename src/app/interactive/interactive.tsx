import React from "react";
import {
  FaCircle as RecordIcon,
  FaCircle as NewIcon, // TODO: fix
  FaTimes as CloseIcon,
} from "react-icons/fa";
import { MdHearing as EarIcon } from "react-icons/md";

import MidiVisualizer from "react-midi-visualizer";

import {
  Segment,
  RecordingSessionConfig,
  Recording,
  PlaySessionConfig,
  AudioSessionConfig,
  AudioEvent,
} from "../../common/types";
import { useStore } from "../../store";
import AudioEngine from "../../audio-engine";
import { getRandomString, blobToBase64, cloneDeep } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";

let recordStopper: NodeJS.Timer | null = null;
let playStopper: NodeJS.Timer | null = null;

interface Dimensions {
  height: number;
  width: number;
}

function Interactive() {
  const { store } = useStore();
  const [randomKey, setRandomKey] = React.useState("default");
  const [dims, setDims] = React.useState<Dimensions | null>(null);
  const [lastComplete, setLastComplete] = React.useState(false);
  const [segment, setSegment] = React.useState<Segment | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);

  const hasActiveAudio = isPlaying || isRecording;

  React.useEffect(() => {
    // TODO: load segment...
  }, []);

  function handleDivLoad(event: any) {
    // TODO: fix any?
    // TODO: might still need ref...?
    const { clientWidth: width, clientHeight: height } = event.target;
    console.log("TODO: is this working?", { width, height });
    setDims({ width, height });
  }

  // TODO: make new reset key when activeSegment changes?

  function renderMidiVisualizer() {
    if (!segment || !dims || isLoading || !startTime) return null;

    const { notes } = segment.midiJson.tracks[0];
    const { height, width } = dims;

    return notes ? (
      <MidiVisualizer
        key={`visualizer-${randomKey}`}
        audioContext={AudioEngine.audioContext}
        height={height}
        width={width}
        startTime={startTime}
        notes={notes}
      />
    ) : null;
  }

  function basicStopAudioEngine(): void {
    if (recordStopper) {
      clearTimeout(recordStopper);
      recordStopper = null;
    }
    if (playStopper) {
      clearTimeout(playStopper);
      playStopper = null;
    }
    setLastComplete(false);
    AudioEngine.stopRecording(hasActiveAudio);
  }

  function stopAudioEngineAndSave(): void {
    const blob = AudioEngine.stopRecording(hasActiveAudio);
    // this.props.dispatch(removeActiveAudioConfig());
    if (blob) {
      setLastComplete(true);
      blobToBase64(blob).then((base64Blob: string) => {
        // this.props.dispatch(
        //   addRecordingToStore({
        //     base64Blob,
        //     startTime,
        //     samplingRate: AudioEngine.audioContext.sampleRate,
        //     segment: this.props.activeSegment,
        //     recordingDate: new Date().toString(),
        //     uploadState: UploadState.CanUpload,
        //   })
        // );
      });
    }
  }

  function handleStartRecording(
    recordingSessionConfig: Partial<RecordingSessionConfig>
  ) {
    const fullConfig = {
      ...recordingSessionConfig,
      startTime: AudioEngine.audioContext.currentTime,
    } as RecordingSessionConfig;

    const recordingLength = (fullConfig.segment.midiJson.duration + 0.5) * 1000;
    recordStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
    AudioEngine.startRecording(fullConfig);
    // this.props.dispatch(setActiveAudioConfig(fullConfig));
  }

  function handleStartPlaying(
    recordingSessionConfig: Partial<PlaySessionConfig>
  ) {
    const fullConfig = {
      ...recordingSessionConfig,
      startTime: AudioEngine.audioContext.currentTime,
    } as PlaySessionConfig;
    const recordingLength = (fullConfig.segment.midiJson.duration + 0.5) * 1000;
    playStopper = setTimeout(stopAudioEngineAndSave, recordingLength);

    AudioEngine.startPlaying(fullConfig);
    // this.props.dispatch(setActiveAudioConfig(fullConfig));
  }

  function renderNewSegmentIcon() {
    return hasActiveAudio ? (
      <NewIcon className="reimagine-unclickable" />
    ) : (
      <NewIcon
        className={isLoading ? "reimagine-spin reimagine-unclickable" : ""}
        onClick={() => null} // this.props.dispatch(getSegmentFromGraphql())
      />
    );
  }

  function renderRecordButton() {
    if (!segment || isPlaying) {
      return <RecordIcon className="reimagine-unclickable" />;
    } else if (isRecording) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      const config: Partial<RecordingSessionConfig> = {
        segment,
        // playMetronome: settings.playRecordConfigs.recordConfig.playMetronome,
        // playNotes: settings.playRecordConfigs.recordConfig.playNotes,
        type: AudioEvent.Recording,
      };

      return <RecordIcon onClick={() => handleStartRecording(config)} />;
    }
  }

  function renderEarIcon() {
    // TODO: this looks almost exactly like the fn above it...?
    if (!segment || isRecording) {
      return <EarIcon className="reimagine-unclickable" />;
    } else if (isPlaying) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      const config: Partial<PlaySessionConfig> = {
        segment,
        // playMetronome:
        //   settings.playRecordConfigs.playSegmentConfig.playMetronome,
        // playNotes: settings.playRecordConfigs.playSegmentConfig.playNotes,
        type: AudioEvent.Playing,
      };
      return <EarIcon onClick={() => handleStartPlaying(config)} />;
    }
  }

  function renderOverlay() {
    const lastRecording =
      lastComplete && store.recordings.length
        ? store.recordings[store.recordings.length - 1]
        : null;
    return (
      <div className="reimagine-interactive-buttons">
        <div>
          {renderNewSegmentIcon()}
          {renderEarIcon()}
        </div>
        <div>
          {renderRecordButton()}
          <UploadIconWrapper recording={lastRecording} />
        </div>
      </div>
    );
  }

  return (
    <div onLoad={handleDivLoad} className="reimagine-interactive">
      {renderOverlay()}
      <div className="reimagine-interactive-midiVisualizer">
        {renderMidiVisualizer()}
      </div>
    </div>
  );
}

export default Interactive;
