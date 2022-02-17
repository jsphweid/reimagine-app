import React, { Reducer } from "react";

import { Section } from "../common/constants";

export interface StoreInterface {
  activeSection: Section;
}

const storeDefaultValues: StoreInterface = {
  activeSection: Section.About,
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
