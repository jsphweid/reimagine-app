import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import MidiVisualizer from "react-midi-visualizer";

import { getAudioEngine as _getAudioEngine } from "../../audio-engine";
import { loadMidiFromJson } from "../../common/helpers";
import {
  useGetNextSegmentLazyQuery,
  useGetUserSettingsQuery,
} from "../../generated";
import { useStore } from "../../providers/store";
import { CloseIcon, EarIcon, NewIcon, RecordIcon } from "../../icon";
import { useParams } from "../../hooks/use-params";
import { useGetSegmentLazyQuery } from "../../generated";

let recordStopper: NodeJS.Timer | null = null;
let playStopper: NodeJS.Timer | null = null;

interface Dimensions {
  height: number;
  width: number;
}

function Recording() {
  const { user } = useAuth0();
  const userId = user?.sub as string;
  const { store, setStore } = useStore();
  const [dims, setDims] = useState<Dimensions | null>(null);
  const [lastComplete, setLastComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [getNxtSeg, getNxtSegRes] = useGetNextSegmentLazyQuery();
  const [getSeg, getSegRes] = useGetSegmentLazyQuery();
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const { params, setParams } = useParams();

  const ref = useRef(null);
  const settingsRes = useGetUserSettingsQuery({ variables: { userId } });
  const settings = settingsRes?.data?.getUserSettingsByUserId || {};

  const segment =
    getNxtSegRes.data?.getNextSegment || getSegRes.data?.getSegmentById || null;
  const isLoading = !!getNxtSegRes.loading;
  const hasActiveAudio = isPlaying || isRecording;

  const getAudioEngine = () =>
    _getAudioEngine().then((audioEngine) => {
      if (!audioCtx) {
        setAudioCtx(audioEngine.audioContext);
      }
      return audioEngine;
    });

  const midi = useMemo(() => {
    return segment ? loadMidiFromJson(segment.midiJson) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment?.id]);

  useEffect(() => {
    if (params.has("segmentId")) {
      const segmentId = params.get("segmentId")!;
      getSeg({ variables: { segmentId } }).then(getAudioEngine);
    } else {
      getNextSegment().then(getAudioEngine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref) {
      const { clientWidth: width, clientHeight: height } = ref.current as any;
      setDims({ width, height });
    }
  }, [ref]);

  function getNextSegment() {
    return getNxtSeg().then(({ data }) => {
      const nxtSegmentId = data?.getNextSegment?.id!;
      setParams({ segmentId: nxtSegmentId });
    });
  }

  function stopLocal() {
    setIsPlaying(false);
    setIsRecording(false);
    setStartTime(0);
  }

  function renderMidiVisualizer() {
    if (!midi || !dims || isLoading) return null;
    const { notes } = midi.tracks[0];
    const { height, width } = dims;

    return notes && audioCtx ? (
      <MidiVisualizer
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
      stopLocal();
      audioEngine.stopRecording();
    });
  }

  function stopAudioEngineAndSave(): void {
    getAudioEngine().then((audioEngine) => {
      stopLocal();
      const blob = audioEngine.stopRecording();
      setLastComplete(true);
      setStore({
        localRecordings: [
          ...store.localRecordings,
          {
            blob,
            dateCreated: new Date(),
            segmentId: segment!.id,
            sampleRate: audioEngine.audioContext.sampleRate,
          },
        ],
      });
    });
  }

  function handleStartRecording() {
    if (midi) {
      getAudioEngine().then((audioEngine) => {
        const startTime = audioEngine.audioContext.currentTime;
        setIsRecording(true);
        setStartTime(startTime);

        const recordingLength = (midi.duration + 0.5) * 1000;
        recordStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
        audioEngine.startRecording({
          playMetronome: !!settings.metronomeOnRecord,
          playNotes: !!settings.notesOnRecord,
          midi,
          startTime,
        });
      });
    }
  }

  function handleStartPlaying() {
    if (midi) {
      setIsPlaying(true);
      getAudioEngine().then((audioEngine) => {
        const startTime = audioEngine.audioContext.currentTime;
        setStartTime(startTime);
        const recordingLength = (midi.duration + 0.5) * 1000;
        playStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
        audioEngine.startPlayingNotes({
          midi,
          startTime,
          playMetronome: !!settings.metronomeOnSegmentPlay,
          playNotes: !!settings.notesOnSegmentPlay,
        });
      });
    } else {
      // TODO: make UI so this is impossible
    }
  }

  function renderNewSegmentIcon() {
    return <NewIcon isDisabled={hasActiveAudio} onClick={getNextSegment} />;
  }

  function renderRecordButton() {
    if (!midi || isPlaying) {
      return <RecordIcon isDisabled />;
    } else if (isRecording) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      return <RecordIcon onClick={() => handleStartRecording()} />;
    }
  }

  function renderEarIcon() {
    // TODO: this looks almost exactly like the fn above it...?
    if (!midi || isRecording) {
      return <EarIcon isDisabled />;
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
      <div className="reimagine-recording-buttons">
        <div>
          {renderNewSegmentIcon()}
          {renderEarIcon()}
        </div>
        <div>
          {renderRecordButton()}
          {/* <UploadIconWrapper recording={lastRecording} /> */}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="reimagine-recording">
      {renderOverlay()}
      <div className="reimagine-recording-midiVisualizer">
        {renderMidiVisualizer()}
      </div>
    </div>
  );
}

export default Recording;
