import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ids: [],
};

const favoriteCookersSlice = createSlice({
  name: "favoriteCookers",
  initialState,
  reducers: {
    setFavoriteCookers(state, action) {
      state.ids = action.payload || [];
    },
    addFavoriteCooker(state, action) {
      const id = action.payload;
      if (!state.ids.includes(id)) state.ids.push(id);
    },
    removeFavoriteCooker(state, action) {
      const id = action.payload;
      state.ids = state.ids.filter((x) => x !== id);
    },
    resetFavorites(state) {
      state.ids = [];
    },
  },
});

export const {
  setFavoriteCookers,
  addFavoriteCooker,
  removeFavoriteCooker,
  resetFavorites,
} = favoriteCookersSlice.actions;

export default favoriteCookersSlice.reducer;
