import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";
export const registerChef = createApi({
    reducerPath: 'registerChef',
    tagTypes: ["Chef"],
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
        registerChef: build.mutation({
            async queryFn(dataChef) {
                try {
                    const { email, password, ...userMetadata } = dataChef;
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: { data: userMetadata },
                    });

                    if (error) return { error };
                    return { data };
                } catch (err) {
                    return { error: { message: err.message } };
                }
            },
            invalidatesTags: ["Chef"],
        }),
    }),
})


export const { useRegisterChefMutation } = registerChef;