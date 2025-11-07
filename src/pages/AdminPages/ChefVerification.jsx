import React from 'react'
import { Box, CardBody, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react'
import ChefTable from '../../components/Admin/ChefVeri_page/ChefTable'
import { useGetCookerApprovalsQuery } from '../../app/features/Admin/cookerApprovalsApi'
export default function ChefVerification() {

const {data: cooker_approvals= [] , isLoading , error} = useGetCookerApprovalsQuery();
console.log (cooker_approvals);

const pending = cooker_approvals.filter(cooker => cooker.status=== "pending").length;
const approved = cooker_approvals.filter (cooker => cooker.status === "approved").length;
const rejected = cooker_approvals.filter (cooker => cooker.status === "rejected").length;
  const kpis = [
    { title: "Pending Applications", number:pending, color: "rgb(244, 192, 37)" },
    { title: "approved Sellers", number: approved, color: "rgb(22, 162, 73)" },
    { title: "Rejected Sellers", number: rejected, color: "rgb(239, 67, 67)" }]


  return (



    <Box>

      {/* Dashboard heading */}
      <Box>

      <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">Seller Verification </Heading>
      <Text fontSize={"18px"} color={"GrayText"} mb="10">
        Review and manage seller applications
      </Text>

      </Box>



      {/* kpis */}


      <SimpleGrid columns={3} justifyContent={"center"} columnGap={"20px"}>

      {kpis.map((kpi)=>(


        <Card.Root borderRadius="xl"

                    h="100%"
                    border={"none"}
                    shadow="sm">
           <CardBody>
            <VStack align="start" spacing={2}>
          <Text color="gray.500" fontSize="15px">
         {kpi.title}
          </Text>
          
          <Text color={kpi.color} fontWeight="bold" fontSize="30px">{kpi.number} </Text>

            </VStack>
           </CardBody>

        </Card.Root>


      )) 



      }


      </SimpleGrid>


    {/* Chef verification Table */}

    <Box my={10}>
    <ChefTable></ChefTable>

    </Box>

    </Box>
  )
}
