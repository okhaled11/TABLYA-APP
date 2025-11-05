
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const cookersApi = createApi({

    reducerPath: "cookersApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ['cookers_approvals', 'cookers'],
    endpoints: (builder) => ({

        getCookersApprovals: builder.query({

            async queryFn() {


                const { data: cooker_approvals, error } = await supabase
                    .from('cooker_approvals')
                    .select('*')
                if (error) return { error }
                return { data: cooker_approvals }
            },
            providesTags: ['cookers_approvals']

        }),



        getCookers: builder.query({
            async queryFn() {

                const { data: cookers, error } = await supabase
                    .from('cookers')
                    .select('*')

             if (error) return { error }
                return { data : cookers}
            },

            providesTags: ['cookers']

        }),


        addCookers : builder.mutation ({

          async queryFn (newCooker){

          const { data, error } = await supabase.from('cookers').insert([newCooker])
                 if (error) return { error }
                 return { data }

          }, 

          invalidatesTags: ['cookers']
          

        })

    })


})
export const {useGetCookersQuery , useAddCookersMutation  , useGetCookersApprovalsQuery}= cookersApi;