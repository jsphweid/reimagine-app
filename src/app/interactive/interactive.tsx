import React, { useMemo, useRef, useState } from "react";
import {
  FaCircle as RecordIcon,
  FaCircle as NewIcon, // TODO: fix
  FaTimes as CloseIcon,
} from "react-icons/fa";
import { MdHearing as EarIcon } from "react-icons/md";

import MidiVisualizer from "react-midi-visualizer";

import {
  getAudioEngine as _getAudioEngine,
  AudioSessionConfig,
} from "../../audio-engine";
import { blobToBase64, loadMidiFromJson } from "../../common/helpers";
import UploadIconWrapper from "../small-components/upload-icon";
import {
  useGetNextSegmentLazyQuery,
  useGetUserSettingsQuery,
} from "../../generated";
import { useAuth0 } from "@auth0/auth0-react";

let recordStopper: NodeJS.Timer | null = null;
let playStopper: NodeJS.Timer | null = null;

interface Dimensions {
  height: number;
  width: number;
}

function Interactive() {
  const { user } = useAuth0();
  const userId = user?.sub as string;

  const [randomKey, setRandomKey] = useState("default");
  const [dims, setDims] = useState<Dimensions | null>(null);
  const [lastComplete, setLastComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [getSeg, getSegRes] = useGetNextSegmentLazyQuery();
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const ref = useRef(null);

  const settingsRes = useGetUserSettingsQuery({ variables: { userId } });
  const settings = settingsRes?.data?.getUserSettingsByUserId || {};

  const segment = getSegRes.data?.getNextSegment || null;
  const hasActiveAudio = isPlaying || isRecording;

  const getAudioEngine = () =>
    _getAudioEngine().then((audioEngine) => {
      if (!audioCtx) {
        setAudioCtx(audioEngine.audioContext);
      }
      return audioEngine;
    });

  const midi = useMemo(
    () => (segment ? loadMidiFromJson(segment.midiJson) : null),
    [segment]
  );

  React.useEffect(() => {
    getSeg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (ref) {
      const { clientWidth: width, clientHeight: height } = ref.current as any;
      setDims({ width, height });
    }
  }, [ref]);

  // TODO: make new reset key when activeSegment changes?

  function renderMidiVisualizer() {
    if (!midi || !dims || isLoading || !startTime) return null;
    const { notes } = midi.tracks[0];
    const { height, width } = dims;

    // TODO: figure out how everything is getting triggered and come up with a better design
    // must be lazy initialized

    return notes && audioCtx ? (
      <MidiVisualizer
        key={`visualizer-${randomKey}`}
        audioContext={audioCtx}
        height={height}
        width={width}
        startTime={startTime}
        notes={notes}
      />
    ) : null;
  }

  function basicStopAudioEngine(): void {
    getAudioEngine().then((audioEngine) => {
      if (recordStopper) {
        clearTimeout(recordStopper);
        recordStopper = null;
      }
      if (playStopper) {
        clearTimeout(playStopper);
        playStopper = null;
      }
      setLastComplete(false);
      audioEngine.stopRecording(hasActiveAudio);
    });
  }

  function stopAudioEngineAndSave(): void {
    getAudioEngine().then((audioEngine) => {
      const blob = audioEngine.stopRecording(hasActiveAudio);
      // this.props.dispatch(removeActiveAudioConfig());
      if (blob) {
        setLastComplete(true);
        blobToBase64(blob).then((base64Blob: string) => {
          // this.props.dispatch(
          //   addRecordingToStore({
          //     base64Blob,
          //     startTime,
          //     samplingRate: audioEngine.audioContext.sampleRate,
          //     segment: this.props.activeSegment,
          //     recordingDate: new Date().toString(),
          //     uploadState: UploadState.CanUpload,
          //   })
          // );
        });
      }
    });
  }

  function handleStartRecording(
    recordingSessionConfig: Partial<AudioSessionConfig>
  ) {
    if (midi) {
      getAudioEngine().then((audioEngine) => {
        const fullConfig = {
          ...recordingSessionConfig,
          startTime: audioEngine.audioContext.currentTime,
        } as AudioSessionConfig;

        const recordingLength = (midi.duration + 0.5) * 1000;
        recordStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
        audioEngine.startRecording(fullConfig);
      });
    }

    // this.props.dispatch(setActiveAudioConfig(fullConfig));
  }

  function handleStartPlaying() {
    if (midi) {
      getAudioEngine().then((audioEngine) => {
        const startTime = audioEngine.audioContext.currentTime;
        setStartTime(startTime);
        const fullConfig = {
          midi,
          startTime,
          playMetronome: settings.metronomeOnSegmentPlay,
          playNotes: settings.notesOnSegmentPlay,
        } as AudioSessionConfig;
        const recordingLength = (midi.duration + 0.5) * 1000;
        playStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
        audioEngine.startPlaying(fullConfig);
        // this.props.dispatch(setActiveAudioConfig(fullConfig));
      });
    } else {
      // TODO: make UI so this is impossible
    }
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
    if (!midi || isPlaying) {
      return <RecordIcon className="reimagine-unclickable" />;
    } else if (isRecording) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      const config: Partial<AudioSessionConfig> = {
        midi,
        // playMetronome: settings.playRecordConfigs.recordConfig.playMetronome,
        // playNotes: settings.playRecordConfigs.recordConfig.playNotes,
      };

      return <RecordIcon onClick={() => handleStartRecording(config)} />;
    }
  }

  function renderEarIcon() {
    // TODO: this looks almost exactly like the fn above it...?
    if (!midi || isRecording) {
      return <EarIcon className="reimagine-unclickable" />;
    } else if (isPlaying) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      return <EarIcon onClick={() => handleStartPlaying()} />;
    }
  }

  function renderOverlay() {
    const lastRecording = null;
    // const lastRecording =
    //   lastComplete && store.recordings.length
    //     ? store.recordings[store.recordings.length - 1]
    //     : null;
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
    <div ref={ref} className="reimagine-interactive">
      {renderOverlay()}
      <div className="reimagine-interactive-midiVisualizer">
        hi
        {renderMidiVisualizer()}
      </div>
    </div>
  );
}

export default Interactive;
