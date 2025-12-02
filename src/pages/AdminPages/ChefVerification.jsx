import React from 'react'
import { Box, CardBody, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react'
import ChefTable from '../../components/Admin/ChefVeri_page/ChefTable'
import { useGetAllCookerApprovalsQuery } from '../../app/features/Admin/cookerApprovalsApi'
import { FiAlertTriangle } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Flex } from '@chakra-ui/react'
import { useColorMode } from '../../theme/color-mode'
import colors from '../../theme/color'
import { IoIosRefreshCircle } from "react-icons/io";

export default function ChefVerification() {

const {colorMode}=useColorMode();

  const { data: cooker_approvals = [], isLoading, error } = useGetAllCookerApprovalsQuery();
 
  const pending = cooker_approvals.filter(cooker => cooker.status === "pending").length;
  const approved = cooker_approvals.filter(cooker => cooker.status === "approved").length;
  const updated = cooker_approvals.filter(cooker => cooker.status === "updated").length;
  // const rejected = cooker_approvals.filter(cooker => cooker.status === "rejected").length;
  const kpis = [
    { title: "Pending Applications", number: pending, color: "rgb(244, 192, 37)", icon: <FiAlertTriangle /> },
    { title: "Approved Sellers", number: approved, color: "rgb(22, 162, 73)", icon: <FaCheckCircle /> },
    { title: "Updated Applications ", number: updated, color: "rgba(188, 32, 202, 1)", icon: <IoIosRefreshCircle />},
    // { title: "Rejected Sellers", number: rejected, color: "rgb(239, 67, 67)", icon: <MdCancel /> }
  
  ]


  return (



    <Box  bg={colorMode ==="light" ? colors.light.bgMain : colors.dark.bgMain  } p={"30px"}>

      {/* Dashboard heading */}
      <Box>

        <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">Seller Verification </Heading>
        <Text fontSize={"18px"} color={"GrayText"} mb="10">
          Review and manage seller applications
        </Text>

      </Box>



      {/* kpis */}

      

      <SimpleGrid columns={3} justifyContent={"center"} columnGap={"20px"} >

        {kpis.map((kpi) => (

          <Card.Root
            borderRadius="xl"
            h="100%"
            border={"none"}
            shadow="sm"
            key={kpi.title}
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.03)" }}
            bg={colorMode === "light" ? "white" : colors.dark.bgThird}
          >
            <CardBody>
              <Flex align="center" gap={"30px"}>
                <Box fontSize="50px" color={kpi.color}>
                  {kpi.icon}
                </Box>

                <VStack align="start" spacing={1}>
                  <Text color="gray.500" fontSize="15px">
                    {kpi.title}
                  </Text>
                  <Text color={kpi.color} fontWeight="bold" fontSize="30px">
                    {kpi.number}
                  </Text>
                </VStack>



              </Flex>
            </CardBody>
          </Card.Root>


        ))



        }


      </SimpleGrid>

     


      {/* Chef verification Table */}

     
        <ChefTable />

     

    </Box>
  )
}
