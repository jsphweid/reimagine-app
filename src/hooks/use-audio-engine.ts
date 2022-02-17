import { useContext } from "react";

import { AudioEngineContext } from "../providers/audio-engine-provider";

export const useAudioEngine = () => useContext(AudioEngineContext);
