import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import workspaceReducer from "../../workspace/redux/slice";

export const rootReducer = combineReducers({
  workspace: workspaceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootDispatch = typeof store.dispatch;
export const useRootDispatch = (): RootDispatch => useDispatch<RootDispatch>();
