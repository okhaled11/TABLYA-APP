import React, { useRef } from 'react'
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import KpisAnalytics from '../../components/Admin/Analytics_page/KpisAnalytics'
import UserGrowthChart from '../../components/Admin/Analytics_page/UserGrowthChart'
import SalesChart from '../../components/Admin/Analytics_page/SalesChart'
import { useState } from 'react'
import Filterdropdown from '../../components/Admin/Analytics_page/Filterdropdown'
import ExportPDF from '../../components/Admin/Analytics_page/Exportpdf'
import { useColorMode } from '../../theme/color-mode'

import colors from '../../theme/color'

export default function Analytics() {
  const {colorMode}= useColorMode();
  const [period, setPeriod] = useState("monthly");

  const kpiRef = useRef();
  return (
    <Box >

      {/* Dashboard heading */}
           <Flex justifyContent={"space-between"}>
            <Box>
            <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">Reports & Analytics</Heading>
            <Text fontSize={"18px"} color={"GrayText"}>
          Detailed insights and exportable reports
      
            </Text>
            </Box>


          <Box mt= {"20px"}  display="flex" alignItems="center" gap="10px" mx={"20px"}>
         <Filterdropdown period= {period} setPeriod= {setPeriod} />

         <ExportPDF targetRef={kpiRef} fileName="kpi-report.pdf" />

          </Box>


           </Flex>

               
            {/* Kpis Analytics */}
            <Box  ref={kpiRef} bg="white" color="black" p={4} borderRadius="md" bg={colorMode === "light" ? "white" : "rgb(24, 19, 16)"}>

            <KpisAnalytics period = {period} setPeriod= {setPeriod} />

            </Box>


            {/* User Growth Chart */}

            <UserGrowthChart/>
           


           {/* Sales Trend (This Month) chart */}

           <SalesChart/>
    </Box>
  )
}
