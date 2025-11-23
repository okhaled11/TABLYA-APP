import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressData: null,
};

export const registrationAddressSlice = createSlice({
  name: "registrationAddress",
  initialState,
  reducers: {
    setRegistrationAddress: (state, action) => {
      state.addressData = action.payload;
    },
    clearRegistrationAddress: (state) => {
      state.addressData = null;
    },
  },
});

export const { setRegistrationAddress, clearRegistrationAddress } =
  registrationAddressSlice.actions;

export default registrationAddressSlice.reducer;
