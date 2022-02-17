import React, { useRef, useEffect, useState } from "react";

import AudioEngine from "../audio-engine";

export const AudioEngineContext = React.createContext<AudioEngine>({} as any);

const AudioEngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [engine, setEngine] = useState<AudioEngine | null>(null);

  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      console.log("setting audio engine!");
      setEngine(new AudioEngine());
    }
  }, [ref]);

  return (
    <AudioEngineContext.Provider value={engine as AudioEngine}>
      <div ref={ref}>{engine ? children : "Loading audio engine..."}</div>
    </AudioEngineContext.Provider>
  );
};

export { AudioEngineProvider };
