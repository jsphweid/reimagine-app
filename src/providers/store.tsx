import { createContext, Reducer, useContext, useReducer } from "react";

import { Section } from "../common/constants";
import { LocalRecording } from "../types";

export interface StoreInterface {
  activeSection: Section;
  localRecordings: LocalRecording[];
}

const storeDefaultValues: StoreInterface = {
  activeSection: Section.About,
  localRecordings: [],
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
