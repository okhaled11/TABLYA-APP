

// import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
// import { supabase } from "../../../services/supabaseClient";



// export const landingReviews = createApi({

//     reducerPath: "landingReviewsApi",
//     baseQuery: fakeBaseQuery(),
//     tagTypes: ["reviews"],
//     endpoints: (builder) => ({


//         getLandingReviews: builder.query({
//             async queryFn() {

//                 const { data: reviews, error } = await supabase
//                     .from("reviews")
//                     .select(
//                         `
//                           *,
//                           customer:customers (
//                                  user:users (
//                                    name,
//                                    avatar_url
//                                  )

//                                )

                           

//                         `

//                     )

//                 if (error) {


//                     return { error: error }
//                 }
                          
//                 return { data: reviews }
                

//             }
//             , providesTags: ["reviews"]

//         })

//     })

// })


// export const { useGetLandingReviewsQuery } = landingReviews; 








import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

export const landingReviews = createApi({
  reducerPath: "landingReviewsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["reviews"],
  endpoints: (builder) => ({
   getLandingReviews: builder.query({
  async queryFn() {
    
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        *,
        customer:customers (
          user:users (
            name,
            avatar_url
          )
        )
      `);
      console.log("Reviews cooker_id:", reviews.map(r => r.cooker_id));

    if (reviewsError) return { error: reviewsError };

   
    const { data: cookers, error: cookersError } = await supabase
      .from("cookers")
       .select("user_id, users(name, avatar_url)")

  console.log("Cookers ids:", cookers.map( c => c.user_id));
    if (cookersError) return { error: cookersError };

  
    const reviewsWithCookers = reviews.map(review => {
      const cooker = cookers.find(c => c.user_id === review.cooker_id);
      return {
        ...review,
        cooker: cooker ? cooker.users : null
      };
    });

    return { data: reviewsWithCookers };
  },
  providesTags: ["reviews"]
})

  })
});

export const { useGetLandingReviewsQuery } = landingReviews;

