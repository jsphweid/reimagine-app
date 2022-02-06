import React, { Reducer } from "react";

import { Section } from "./common/constants";
import { Recording } from "./common/types";

export interface PlayRecordFlags {
  metronomeOnSegmentPlay: boolean;
  notesOnSegmentPlay: boolean;
  metronomeOnRecord: boolean;
  notesOnRecord: boolean;
  metronomeOnRecordingPlay: boolean;
  notesOnRecordingPlay: boolean;
}

export interface StoreInterface extends PlayRecordFlags {
  activeSection: Section;
  recordings: Recording[];
}

const storeDefaultValues: StoreInterface = {
  activeSection: Section.About,
  recordings: [],

  // settings
  metronomeOnSegmentPlay: false,
  notesOnSegmentPlay: true,
  metronomeOnRecord: false,
  notesOnRecord: false,
  metronomeOnRecordingPlay: false,
  notesOnRecordingPlay: false,
};

const StoreContext = React.createContext(storeDefaultValues);
const DispatchStoreContext = React.createContext(undefined);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer<Reducer<StoreInterface, any>>(
    (state, newValue) => ({ ...state, ...newValue }),
    storeDefaultValues
  );

  return (
    <StoreContext.Provider value={state}>
      <DispatchStoreContext.Provider value={dispatch as any}>
        {children}
      </DispatchStoreContext.Provider>
    </StoreContext.Provider>
  );
};

const useStore = () => ({
  store: React.useContext(StoreContext),
  setStore: React.useContext(DispatchStoreContext) as any,
});

export { StoreProvider, useStore };
