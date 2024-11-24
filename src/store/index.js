import { create } from "zustand";
import { createUserSlice } from "./slices/user-slice";
import { createPropertySlice } from "./slices/property-slice";

export const useAppStore = create()((...a) => ({
  ...createUserSlice(...a),
  ...createPropertySlice(...a),
}));
