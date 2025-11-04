import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../../services/supabaseClient";

const initialState = {
  userData: null,
  loading: false,
  error: null,
};

export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password, ...userMetaData } = userData;

      // const name = `${firstName} ${lastName}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetaData
        },
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const customerRegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerRegisterSlice.reducer;
