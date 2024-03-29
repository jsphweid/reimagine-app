import { createContext, Reducer, useContext, useReducer } from "react";

import { LocalRecording } from "../types";
import { Segment } from "../generated";

export interface StoreInterface {
  localRecordings: LocalRecording[];
  recentlyUploaded: string[]; // recording ids recently uploaded
  segments: Segment[];
  segmentIndex: number;
}

const storeDefaultValues: StoreInterface = {
  localRecordings: [],
  recentlyUploaded: [],
  segments: [],
  segmentIndex: 0,
};

const StoreContext = createContext(storeDefaultValues);
const DispatchStoreContext = createContext(undefined);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer<Reducer<StoreInterface, any>>(
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
  store: useContext(StoreContext),
  setStore: useContext(DispatchStoreContext) as any,
});

export { StoreProvider, useStore };
