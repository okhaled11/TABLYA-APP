

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";



export const landingReviews = createApi({

    reducerPath: "landingReviewsApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["reviews"],
    endpoints: (builder) => ({


        getLandingReviews: builder.query({
            async queryFn() {

                const { data: reviews, error } = await supabase
                    .from("reviews")
                    .select(
                        `
                          *,
                          customer:customers (
                                 user:users (
                                   name,
                                   avatar_url
                                 )
                               )
                        `

                    )

                if (error) {


                    return { error: error }
                }
                return { data: reviews }

            }
            , providesTags: ["reviews"]

        })

    })

})


export const { useGetLandingReviewsQuery } = landingReviews; 
