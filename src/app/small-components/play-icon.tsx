import { useState } from "react";

import { AnyRecording } from "../../types";
import { getAudioEngine } from "../../audio-engine";
import { useStore } from "../../providers/store";
import { PlayIcon, StopIcon } from "../../icon";

export interface PlayIconWrapperProps {
  recording: AnyRecording;
}

function PlayIconWrapper(props: PlayIconWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { store, setStore } = useStore();

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
    <StopIcon onClick={handleStopClicked} isLoading={isLoading} />
  ) : (
    <PlayIcon onClick={handleStartClicked} isLoading={isLoading} />
  );
}

export default PlayIconWrapper;
