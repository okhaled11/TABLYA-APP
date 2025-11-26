import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../../services/supabaseClient";

const initialState = {
  userData: null,
  loading: false,
  error: null,
  isPending: false,
};

// ✅ handle login with approval check
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(user);

      if (error) {
        return rejectWithValue(error.message);
      }

      const currentUser = data?.user;

      if (!currentUser) {
        return rejectWithValue("User not found");
      }

      // 🔍 get role from user metadata
      const role = currentUser.user_metadata?.role;

      // ✅ if cooker => check approval
      if (role === "cooker") {
        // check if approved
        const { data: cookerData, error: cookerError } = await supabase
          .from("cookers")
          .select("is_approved")
          .eq("user_id", currentUser.id)
          .single();

        if (cookerError && cookerError.code !== "PGRST116") {
          // (PGRST116 = no rows found, so ignore that)
          return rejectWithValue(cookerError.message);
        }

        if (!cookerData || cookerData.is_approved === false) {
          // لو مش approved
          // Do NOT sign out here. Let them stay logged in to see the pending page.
          return rejectWithValue({
            type: "pending",
            message:
              "Your account is pending admin approval. Please try again later.",
          });
        }
      }

      // ✅ success
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// handle logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return rejectWithValue(error.message);
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Check if it's a pending approval case
        if (action.payload?.type === "pending") {
          state.isPending = true;
          state.error = null;
        } else {
          state.error = action.payload;
          state.isPending = false;
        }
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;