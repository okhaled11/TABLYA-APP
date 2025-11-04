import React from 'react'
import { Box, Heading, HStack, Text } from '@chakra-ui/react'

import Kpis from '../../components/Admin/Dashboard_page/kpis';
import RevenueChart from '../../components/Admin/Dashboard_page/RevenueChart';
import CuisinesChart from '../../components/Admin/Dashboard_page/CuisinesChart';
import OrderActivity from '../../components/Admin/Dashboard_page/OrderActivity';

export default function Dashboard() {




  return (
    <Box>

      {/* Dashboard heading */}
      <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">DashBoard Overview </Heading>
      <Text fontSize={"18px"} color={"GrayText"}>
        Track your platform's performance and metrics

      </Text>

      {/* KPIS  */}


      <Kpis />

   {/* Charts ( Revenue and Cuisines) */}

      <HStack spacing={4}>

        <RevenueChart />

        <CuisinesChart />


      </HStack>

     {/* order activity chart */}
      <OrderActivity />



    </Box>
  )
}
