// src/store.js
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Create a store with the blockchain slice
const blockchainSlice = createSlice({
  name: "blockchain",
  initialState: {
    isUpdated: true,
  } as BlockchainState, // Ensure initial state conforms to BlockchainState type
  reducers: {
    setIsUpdated: (state, action: PayloadAction<boolean>) => {
      // Use PayloadAction for type safety
      state.isUpdated = action.payload;
    },
  },
});

// Export actions for use in components
export const { setIsUpdated } = blockchainSlice.actions;

// Create a store with the blockchain slice
const store = configureStore({
  reducer: {
    blockchain: blockchainSlice.reducer,
  },
});

export default store;
