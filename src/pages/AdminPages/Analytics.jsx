import React from 'react'
import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import KpisAnalytics from '../../components/Admin/Analytics_page/KpisAnalytics'
import UserGrowthChart from '../../components/Admin/Analytics_page/UserGrowthChart'
import SalesChart from '../../components/Admin/Analytics_page/SalesChart'
export default function Analytics() {
  return (
    <Box>

      {/* Dashboard heading */}
            <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">Reports & Analytics</Heading>
            <Text fontSize={"18px"} color={"GrayText"}>
          Detailed insights and exportable reports
      
            </Text>


            {/* Kpis Analytics */}

            <KpisAnalytics/>


            {/* User Growth Chart */}

            <UserGrowthChart/>
           


           {/* Sales Trend (This Month) chart */}

           <SalesChart/>
    </Box>
  )
}
