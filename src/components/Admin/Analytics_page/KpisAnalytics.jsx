import React from 'react'
import { Box, SimpleGrid, Text, Card, CardBody, Container, VStack, Flex } from '@chakra-ui/react'
import { useColorMode } from "../../../theme/color-mode";
import { useGetTotalRevenueQuery } from '../../../app/features/Admin/dashboardApi';
import { useGetTotalOrdersQuery } from '../../../app/features/Admin/dashboardApi';
import { useGetPlatformProfitQuery } from '../../../app/features/Admin/dashboardApi';
export default function KpisAnalytics() {

const { colorMode } = useColorMode();
const {data :totalRevenue = [] }= useGetTotalRevenueQuery();
const {data :totalOrders = []}=  useGetTotalOrdersQuery();
const {data :platformProfit = []}=  useGetPlatformProfitQuery();






  return (
      <SimpleGrid columns={3} justifyContent={"center"} columnGap={"20px"} mt={"30px"}>
                    {/* Total Revenue */}
                    <Card.Root bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                        borderRadius="xl"
    
                        h="100%"
                        border={"none"}
                        shadow="sm"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.03)" }}>
    
                        <CardBody>
                            <VStack align="start" spacing={2}>
    
                                {/* Title */}
                                <Text color="gray.500" fontSize="15px">Total Revenue</Text>
    
                                {/* Value + Icon */}
                                
                                    <Text fontWeight="bold" fontSize="20px">{totalRevenue} EGP</Text>
                                    
                                
    
                                {/* Sub text */}
                                <Text color="rgb(69, 178, 137)" fontSize="14px">+12.5% from last month</Text>
    
                            </VStack>
                        </CardBody>
    
                    </Card.Root>
    
    
                    {/* total orders */}
                    <Card.Root bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                        borderRadius="xl"
    
                        h="100%"
                        border={"none"}
                        shadow="sm"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.03)" }}>
    
                        <CardBody>
    
                            <VStack align="start" spacing={2}>
    
                                {/* Title */}
                                <Text color="gray.500" fontSize="15px">Total Orders</Text>
    
                                {/* Value + Icon */}
                               
                                    <Text fontWeight="bold" fontSize="20px">{totalOrders}</Text>
                                    
                               
    
                                {/* Sub text */}
                                <Text color="rgb(69, 178, 137)" fontSize="14px">+12.5% from last month</Text>
    
                            </VStack>
    
    
    
                        </CardBody>
    
                    </Card.Root>
    
                    {/* Platform Profit*/}
    
                    <Card.Root
    
                        bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                        borderRadius="xl"
    
                        h="100%"
                        border={"none"}
                        shadow="sm"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.03)" }}>
    
                        <CardBody>
    
                            <VStack align="start" spacing={2}>
    
                                {/* Title */}
                                <Text color="gray.500" fontSize="15px">Platform Profit</Text>
    
                                {/* Value + Icon */}
                                
                                    <Text fontWeight="bold" fontSize="20px">{platformProfit}EGP</Text>
                                    
                               
    
                                {/* Sub text */}
                                <Text color="rgb(69, 178, 137)" fontSize="14px">+4.2% from last month</Text>
    
                            </VStack>
                        </CardBody>
    
                    </Card.Root>
    
    
    
                  
    
    
    
    
    
                </SimpleGrid>
    
    
  )
}
