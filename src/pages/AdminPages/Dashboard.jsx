import React from 'react'
import { Box, Heading, HStack, Text , Flex } from '@chakra-ui/react'

import Kpis from '../../components/Admin/Dashboard_page/Kpis';
import RevenueChart from '../../components/Admin/Dashboard_page/RevenueChart';
import CuisinesChart from '../../components/Admin/Dashboard_page/CuisinesChart';
import OrderActivity from '../../components/Admin/Dashboard_page/OrderActivity';
import ExportKPIs from '../../components/Admin/Analytics_page/ExportKPIs';
import { useColorMode } from '../../theme/color-mode';
import colors from '../../theme/color';
export default function Dashboard() {
const {colorMode} = useColorMode();



  return (
    <Box bg={colorMode ==="light" ? colors.light.bgMain : colors.dark.bgMain  } p={"30px"}>
      <Flex justifyContent={"space-between"}>
      <Box>

      {/* Dashboard heading */}
      <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">DashBoard Overview </Heading>
      <Text fontSize={"18px"} color={"GrayText"}>
        Track your platform's performance and metrics

      </Text>


      </Box>
      <Box mr={"40px"} mt={"30px"}>

      <ExportKPIs/>

      </Box>

      </Flex>

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
