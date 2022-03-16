import { useEffect, useState } from "react";

import { getAudioEngine } from "../../audio-engine";
import { PlayIcon, StopIcon } from "../../icon";

export interface PlayIconWrapperProps {
  url: string;
}

function PlayIconWrapper(props: PlayIconWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      getAudioEngine().then((e) => {
        e.stopPlayingRecording();
      });
    };
  }, []);

  function handleAudioStoppedPlaying() {
    setIsPlaying(false);
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
      e.startPlayingUrl(props.url, handleAudioStoppedPlaying);
      setIsLoading(false);
      setIsPlaying(true);
    });
  }

  return isPlaying ? (
    <StopIcon onClick={handleStopClicked} isLoading={isLoading} />
  ) : (
    <PlayIcon onClick={handleStartClicked} isLoading={isLoading} />
  );
}

export default PlayIconWrapper;
