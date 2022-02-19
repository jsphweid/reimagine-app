import { useState } from "react";
import { FaPlay as PlayIcon, FaStop as StopIcon } from "react-icons/fa";

import { AnyRecording } from "../../types";
import { getAudioEngine } from "../../audio-engine";
import { useStore } from "../../providers/store";

export interface PlayIconWrapperProps {
  recording: AnyRecording;
}

function PlayIconWrapper(props: PlayIconWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { store, setStore } = useStore();

  const className = isLoading ? "reimagine-spin reimagine-unclickable" : "";

  function handleAudioStoppedPlaying() {
    setStore({ isPlaying: false });
  }

  function handleStopClicked() {
    setIsLoading(true);
    getAudioEngine().then((e) => {
      e.stopPlayingRecording();
      setIsLoading(false);
      handleAudioStoppedPlaying();
    });
  }

  function handleStartClicked() {
    setIsLoading(true);
    getAudioEngine().then((e) => {
      e.startPlayingRecording(props.recording, handleAudioStoppedPlaying);
      setIsLoading(false);
      setStore({ isPlaying: true });
    });
  }

  return store.isPlaying ? (
    <StopIcon onClick={handleStopClicked} {...{ className }} />
  ) : (
    <PlayIcon onClick={handleStartClicked} {...{ className }} />
  );
}

export default PlayIconWrapper;
