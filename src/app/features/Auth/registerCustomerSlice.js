import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../../services/supabaseClient";

const initialState = {
  userData: null,
  loading: false,
  error: null,
  needsEmailConfirmation: false,
  confirmationMessage: null,
};

export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { email, password, ...userMetaData } = userData;

      // Get address data from Redux state
      const addressData = getState().registrationAddress?.addressData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { ...userMetaData, address: addressData },
          // Add redirect URL for email confirmation
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      // If user registration is successful and address exists, save address to database
      if (data.user && addressData) {
        try {
          await supabase.from("addresses").insert({
            user_id: data.user.id,
            label: addressData.label,
            city: addressData.city,
            area: addressData.area,
            street: addressData.street,
            building_no: addressData.buildingNumber,
            floor: addressData.floor || null,
            apartment: addressData.apartment || null,
            latitude: addressData.latitude || null,
            longitude: addressData.longitude || null,
            is_default: true, // First address is default
          });
        } catch (addressError) {
          console.error("Failed to save address:", addressError);
          // Don't fail registration if address save fails
        }
      }

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        return {
          ...data,
          needsEmailConfirmation: true,
          message:
            "Please check your email and click the confirmation link to complete registration.",
        };
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
        state.needsEmailConfirmation =
          action.payload.needsEmailConfirmation || false;
        state.confirmationMessage = action.payload.message || null;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerRegisterSlice.reducer;
