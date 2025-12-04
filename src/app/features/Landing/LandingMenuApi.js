
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const LandingMenuApi = createApi({

    reducerPath: "landingMenu",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({

        getLandingMenuItems: builder.query({


            async queryFn() {

                try {
                    const { data, error } = await supabase
                        .from("menu_items")
                        .select("*")

                    if (error) return { error }

                    const uniqueByCooker = data.reduce((acc, item) => {
                        if (!acc.some(m => m.cooker_id === item.cooker_id)) {
                            acc.push(item);
                        }
                        return acc;
                    }, []);

                   



                const { data: cookers, error: cookersError } = await supabase
                    .from("cookers")
                    .select("kitchen_name , user_id, users(name, avatar_url)")
              
                
                  if (cookersError) return { error: cookersError };
              
                
                  const menuwithcooker = uniqueByCooker.map(menu=> {
                    const cooker = cookers.find(c => c.user_id === menu.cooker_id);
                    return {
                      ...menu,
                      cooker: cooker ? cooker.users : null,
                      kitchen_name: cooker?.kitchen_name || null
                    };
                  });
              
                  return { data: menuwithcooker };









                }
                catch (err) {

                    return { error: err };

                }

            }

            , providesTags: ["MenuItems"]
        })

    })
});



export const { useGetLandingMenuItemsQuery } = LandingMenuApi;