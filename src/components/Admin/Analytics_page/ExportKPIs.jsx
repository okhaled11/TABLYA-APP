import React from "react";
import  { useGetTotalRevenueQuery, useGetTotalOrdersQuery, useGetAverageOrderValueQuery, useGetPlatformProfitQuery, useGetGrowthRateQuery } from "../../../app/features/Admin/dashboardApi";
import { useGetUsersQuery } from "../../../app/features/UserSlice";
import { MdOutlineFileDownload } from "react-icons/md";
import { Flex, Button } from "@chakra-ui/react";
import colors from "../../../theme/color";

export default function ExportKPIs() {
  const { data: totalRevenue } = useGetTotalRevenueQuery("monthly");
  const { data: totalOrders } = useGetTotalOrdersQuery("monthly");
  const { data: avgOrder } = useGetAverageOrderValueQuery();
  const { data: platformProfit } = useGetPlatformProfitQuery("monthly");
  const { data: growthRate } = useGetGrowthRateQuery();
  const { data: users  } = useGetUsersQuery();

  const handleExport = () => {
    const headers = ["KPI", "Value"];

    const rows = [
      ["Total Revenue", totalRevenue || 0],
      ["Total Orders", totalOrders || 0],
      ["Average Order Value", avgOrder?.toFixed(2) || 0],
      ["Platform Profit", platformProfit || 0],
      ["Growth Rate (%)", growthRate?.toFixed(2) || 0],
      ["Total Users ", users.length || 0],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kpis.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  return (
    

<Flex justify="flex-start" my={4}>
      <Button
        onClick={handleExport}
        bg={colors.light.mainFixed}
        color="white"
        borderRadius="6px"
        px={4}
        py={5}
        _hover={{ bg: colors.light.mainFixed }}
       
      >
        Export KPIs to CSV <MdOutlineFileDownload />
      </Button>
    </Flex>
  );
}
