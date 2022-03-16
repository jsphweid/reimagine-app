import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import MidiVisualizer from "react-midi-visualizer";

import { getAudioEngine as _getAudioEngine } from "../../audio-engine";
import {
  Segment,
  useGetNextSegmentLazyQuery,
  useGetSegmentLazyQuery,
  useGetMySettingsQuery,
} from "../../generated";
import { useStore } from "../../providers/store";
import {
  CloseIcon,
  ForwardIcon,
  MixerIcon,
  PlayIcon,
  RecordIcon,
  StopIcon,
} from "../../icon";
import { useQueryParams } from "../../hooks/use-query-params";
import { BackwardsIcon } from "../../icon";
import UploadIconWrapper from "../small-components/upload-icon";
import { LocalRecording } from "../../types";
import { getRecordDurationMillis, isIOS } from "../../utils";

let recordStopper: NodeJS.Timer | null = null;
let playStopper: NodeJS.Timer | null = null;

interface Dimensions {
  height: number;
  width: number;
}

// If we don't do this, then `loading` will not be accurate
const queryConfig = { notifyOnNetworkStatusChange: true };

function Recording() {
  const { store, setStore } = useStore();
  const [dims, setDims] = useState<Dimensions | null>(null);
  const [uploadIconBounce, setUploadIconBounce] = useState(false);
  const [lastRec, setLastRec] = useState<LocalRecording | null>(null);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [getNxtSeg, getNxtSegRes] = useGetNextSegmentLazyQuery(queryConfig);
  const [getSeg, getSegRes] = useGetSegmentLazyQuery(queryConfig);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const history = useHistory();
  const { params, setParams } = useQueryParams();

  useEffect(() => {
    return () => {
      getAudioEngine().then((e) => {
        e.stopPlayingRecording();
      });
    };
  }, []);

  const ref = useRef(null);
  const settingsRes = useGetMySettingsQuery();
  const settings = settingsRes?.data?.getMyUserSettings || {};

  const segment = store.segments[store.segmentIndex];
  const isLoading = getNxtSegRes.loading || getSegRes.loading;
  const hasActiveAudio = isPlaying || isRecording;

  const getAudioEngine = () =>
    _getAudioEngine().then((audioEngine) => {
      if (!audioCtx) {
        setAudioCtx(audioEngine.audioContext);
      }
      return audioEngine;
    });

  function handleNewSegmentFetched(segment: Segment) {
    // For now, we'll just always push it to the store unless it's the last one
    const last = store.segments[store.segments.length - 1];
    if (!last || last.id !== segment.id) {
      const segments = [...store.segments, segment];
      setStore({ segments, segmentIndex: segments.length - 1 });
    }
  }

  function handleComponentLoad() {
    if (params.has("segmentId")) {
      const segmentId = params.get("segmentId")!;
      getCurrSegment(segmentId);
    } else if (store.segments.length) {
      setParams({ segmentId: store.segments[store.segmentIndex].id });
    } else {
      getNextSegment();
    }
  }

  function setRefIfExists() {
    if (ref) {
      const { clientWidth: width, clientHeight: height } = ref.current as any;
      setDims({ width, height });
    }
  }

  useEffect(handleComponentLoad, []);
  useEffect(setRefIfExists, [ref]);

  function getNextSegment() {
    // TODO: this was a quick fix, but this whole thing should be cleaner
    // this logic shouldn't exist in multiple places
    if (
      store.segments.length &&
      store.segments.length - 1 !== store.segmentIndex
    ) {
      const segmentIndex = store.segmentIndex + 1;
      setStore({ segmentIndex });
      setParams({ segmentId: store.segments[segmentIndex].id });
      return;
    }

    return getNxtSeg().then(({ data }) => {
      const nxtSegment = data?.getNextSegment!;
      setParams({ segmentId: nxtSegment.id });
      handleNewSegmentFetched(nxtSegment);
    });
  }

  function getCurrSegment(segmentId: string) {
    getSeg({ variables: { segmentId } }).then(({ data }) => {
      handleNewSegmentFetched(data?.getSegmentById!);
    });
  }

  function handleForwardClicked() {
    if (store.segments.length - 1 === store.segmentIndex) {
      getNextSegment();
    } else {
      const segmentIndex = store.segmentIndex + 1;
      setStore({ segmentIndex });
      setParams({ segmentId: store.segments[segmentIndex].id });
    }
  }

  function handleBackwardsClicked() {
    const segmentIndex = store.segmentIndex - 1;
    setStore({ segmentIndex });
    setParams({ segmentId: store.segments[segmentIndex].id });
  }

  function stopLocal() {
    setIsPlaying(false);
    setIsRecording(false);
    setStartTime(0);
  }

  function renderMidiVisualizer() {
    if (!segment || !dims || isLoading) return null;
    const { height, width } = dims;

    return (
      <MidiVisualizer
        audioContext={audioCtx}
        height={height}
        width={width}
        startTime={startTime}
        notes={segment.notes}
        options={{
          fps: 120,
        }}
      />
    );
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
      setLastRec(null);
      stopLocal();
      audioEngine.stopRecording();
    });
  }

  function triggerUploadBounce() {
    setUploadIconBounce(true);
    setTimeout(() => setUploadIconBounce(false), 2000);
  }

  function stopAudioEngineAndSave(): void {
    getAudioEngine().then((audioEngine) => {
      stopLocal();
      const blob = audioEngine.stopRecording();
      const { sampleRate, currentTime } = audioEngine.audioContext;
      const recording = {
        blob,
        sampleRate,
        dateCreated: new Date(),
        segmentId: segment!.id,
        duration: currentTime - startTime,
      };
      setLastRec(recording);
      triggerUploadBounce();
      setStore({
        localRecordings: [...store.localRecordings, recording],
      });
    });
  }

  function handleStartRecording() {
    if (segment.notes) {
      getAudioEngine().then((audioEngine) => {
        const startTime = audioEngine.audioContext.currentTime;
        setIsRecording(true);
        setStartTime(startTime);

        const recordingLength = getRecordDurationMillis(segment.notes) + 500;
        recordStopper = setTimeout(stopAudioEngineAndSave, recordingLength);
        audioEngine.startRecording({
          playMetronome: !!settings.metronomeOnRecord,
          playNotes: !!settings.notesOnRecord,
          notes: segment.notes,
          startTime,
          bpm: segment.bpm,
        });
      });
    }
  }

  function handleStartPlaying() {
    if (segment.notes) {
      setIsPlaying(true);
      getAudioEngine().then((audioEngine) => {
        const startTime = audioEngine.audioContext.currentTime;
        setStartTime(startTime);
        const recordingLength = getRecordDurationMillis(segment.notes) + 500;
        playStopper = setTimeout(basicStopAudioEngine, recordingLength);
        audioEngine.startPlayingNotes({
          notes: segment.notes,
          startTime,
          playMetronome: !!settings.metronomeOnSegmentPlay,
          playNotes: !!settings.notesOnSegmentPlay,
          bpm: segment.bpm,
        });
      });
    } else {
      // TODO: make UI so this is impossible
    }
  }

  function renderRecordButton() {
    if (!segment || isPlaying) {
      return <RecordIcon isDisabled />;
    } else if (isRecording) {
      return <CloseIcon onClick={basicStopAudioEngine} />;
    } else {
      return <RecordIcon onClick={() => handleStartRecording()} />;
    }
  }

  function renderPlayStop() {
    // TODO: this looks almost exactly like the fn above it...?
    if (!segment || isRecording) {
      return <PlayIcon isDisabled />;
    } else if (isPlaying) {
      return <StopIcon onClick={basicStopAudioEngine} />;
    } else {
      return <PlayIcon onClick={handleStartPlaying} />;
    }
  }

  function renderIOS() {
    if (isIOS()) {
      return (
        <p className="reimagine-recording-ios">
          NOTE: You may need to physically take your phone off silent mode to
          hear.
        </p>
      );
    }
    return null;
  }

  function renderUploadMixIcon() {
    // should render upload after recording, and mix after uploading
    // then nothing else once interacted with
    // <MixerIcon />
    const bounce = uploadIconBounce ? "reimagine-bounce-icon" : "";
    if (lastRec) {
      return (
        <div className={`reimagine-recording-buttons-uploadLast ${bounce}`}>
          <UploadIconWrapper
            recording={lastRec}
            uploadComplete={(recording) => {
              setLastRec(null);
              setLastUploaded(recording.id);
              getNextSegment();
            }}
          />
        </div>
      );
    } else if (lastUploaded) {
      return (
        <div className={`reimagine-recording-buttons-uploadLast`}>
          <MixerIcon
            onClick={() =>
              history.push(`/create-mix?recordingId=${lastUploaded}`)
            }
          />
        </div>
      );
    } else {
      return null;
    }
  }

  function renderOverlay() {
    return (
      <div className="reimagine-recording-buttons">
        {renderUploadMixIcon()}
        <div className="reimagine-recording-buttons-center">
          <BackwardsIcon
            onClick={handleBackwardsClicked}
            isDisabled={hasActiveAudio || isLoading || store.segmentIndex === 0}
          />
          {renderPlayStop()}
          {renderRecordButton()}
          <ForwardIcon
            isDisabled={hasActiveAudio || isLoading}
            onClick={handleForwardClicked}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="reimagine-recording">
      {renderOverlay()}
      {renderIOS()}
      <div className="reimagine-recording-midiVisualizer">
        {renderMidiVisualizer()}
      </div>
    </div>
  );
}

export default Recording;
