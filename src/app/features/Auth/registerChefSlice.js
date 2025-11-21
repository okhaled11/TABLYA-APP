import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";
export const registerChef = createApi({
  reducerPath: "registerChef",
  tagTypes: ["Chef"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    registerChef: build.mutation({
      async queryFn(dataChef, { getState }) {
        try {
          const { email, password, ...userMetadata } = dataChef;

          // Get address data from Redux state
          const addressData = getState().registrationAddress?.addressData;

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { ...userMetadata, address: addressData } },
          });

          if (error) return { error };

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

          return { data };
        } catch (err) {
          return { error: { message: err.message } };
        }
      },
      invalidatesTags: ["Chef"],
    }),
  }),
});

export const { useRegisterChefMutation } = registerChef;
