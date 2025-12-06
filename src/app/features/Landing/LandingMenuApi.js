
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const LandingMenuApi = createApi({

    reducerPath: "landingMenu",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({

        getLandingMenuItems: builder.query({
     
            //display one menu item from every menu 

            // async queryFn() {

            //     try {
            //         const { data, error } = await supabase
            //             .from("menu_items")
            //             .select("*")

            //         if (error) return { error }

            //         const uniqueByCooker = data.reduce((acc, item) => {
            //             if (!acc.some(m => m.cooker_id === item.cooker_id)) {
            //                 acc.push(item);
            //             }
            //             return acc;
            //         }, []);

                   



            //     const { data: cookers, error: cookersError } = await supabase
            //         .from("cookers")
            //         .select("kitchen_name , user_id, users(name, avatar_url)")
              
                
            //       if (cookersError) return { error: cookersError };
              
                
            //       const menuwithcooker = uniqueByCooker.map(menu=> {
            //         const cooker = cookers.find(c => c.user_id === menu.cooker_id);
            //         return {
            //           ...menu,
            //           cooker: cooker ? cooker.users : null,
            //           kitchen_name: cooker?.kitchen_name || null
            //         };
            //       });
              
            //       return { data: menuwithcooker };









            //     }
            //     catch (err) {

            //         return { error: err };

            //     }

            // }
            



//temporarry until data is enough to display one item from every chef menu
          async queryFn() {
  try {

    const { data: cookers, error: cookersError } = await supabase
      .from("cookers")
      .select("kitchen_name, user_id, users(name, avatar_url)")
      .in("kitchen_name", ["Wasafat Mama", "ObaS ComboS", "hekaya we rewia" ]);

    if (cookersError) return { error: cookersError };

    if (!cookers || cookers.length === 0)
      return { data: [] };

    const cookerIds = cookers.map(c => c.user_id);

    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("*")
      .in("cooker_id", cookerIds);

    if (menuError) return { error: menuError };


    
    const finalItems = [];

    ["hekaya we rewia", "ObaS ComboS", "Wasafat Mama"].forEach(kitchen => {

      
      const kitchenCookers = cookers.filter(c => c.kitchen_name === kitchen);

     
      const kitchenMenus = menuItems
        .filter(m => kitchenCookers.find(c => c.user_id === m.cooker_id))
        .slice(0, 3); 

      
      finalItems.push(...kitchenMenus);
    });


   
    const menuwithcooker = finalItems.map(menu => {
      const cooker = cookers.find(c => c.user_id === menu.cooker_id);
      return {
        ...menu,
        cooker: cooker ? cooker.users : null,
        kitchen_name: cooker?.kitchen_name || null
      };
    });

    return { data: menuwithcooker };

  } catch (err) {
    return { error: err };
  }
}


            , providesTags: ["MenuItems"]
        })

    })
});



export const { useGetLandingMenuItemsQuery } = LandingMenuApi;