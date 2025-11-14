
import { supabase } from "../../../services/supabaseClient";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


 export const MariamSettingsApi = createApi ({

    reducerPath: "SettingsApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["settings"],

    endpoints : (builder)=>({
    
// mutation of platform profit , chef commession , servicefee , delivery 

updateSettings: builder.mutation({
 async queryFn({ platform_commission_pct, chef_commission_pct, service_fee_amount, default_delivery_fee }) {
  const { data, error } = await supabase
    .from("platform_settings")
    .update({
      platform_commission_pct,
      chef_commission_pct,
      service_fee_amount,
      default_delivery_fee,
    })
    .eq("id", "b63fcd43-7207-4ddf-a735-24467a0293dc")
    .single();

  if (error) return { error };
  return { data };
}
,
  invalidatesTags: ["settings"],
}),



 //total revenue * platform profit 
getPlatformProfit : builder.query({
  
async queryFn (){

const {data :settings , error }= await supabase
.from ("platform_settings")
.select ("*")
.eq("id" ,"b63fcd43-7207-4ddf-a735-24467a0293dc" )

if (error) return {error};



const {data :orders , error :orderserror} = await supabase 
.from("orders")
.select("total")

if (orderserror) return { error :orderserror };

const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total || 0), 0);

const platformProfit = totalRevenue * (settings.platform_commission_pct || 0); 
const chefProfit = totalRevenue * (settings.chef_commission_pct || 0);



return { data: { totalRevenue, platformProfit, chefProfit } };





}



, providesTags: ["settings"]


})


     
    })






})

 export const { useGetPlatformProfitQuery, useUpdateSettingsMutation } = MariamSettingsApi;
