import React from 'react'
import { Box, SimpleGrid, Text, Card, CardBody, Container, VStack, Flex } from '@chakra-ui/react'
import { useColorMode } from "../../../theme/color-mode";
import { useGetTotalRevenueQuery } from '../../../app/features/Admin/dashboardApi';
import { useGetTotalOrdersQuery } from '../../../app/features/Admin/dashboardApi';
import { useGetPlatformProfitQuery } from '../../../app/features/Admin/dashboardApi';
import { HiShoppingBag } from "react-icons/hi2";
import { GiMoneyStack } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";

export default function KpisAnalytics({ period }) {

    const { colorMode } = useColorMode();
    const { data: totalRevenue = [] } = useGetTotalRevenueQuery(period);
    const { data: totalOrders = [] } = useGetTotalOrdersQuery(period);
    const { data: platformProfit = [] } = useGetPlatformProfitQuery(period);
    


// console.log("data", period);


    return (
        <SimpleGrid columns={3} justifyContent={"center"} columnGap={"20px"} mt={"30px"}>
            {/* Total Revenue */}
            <Card.Root bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                borderRadius="xl"
                py={"10px"}
                h="100%"
                border={"none"}
                shadow="sm"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.03)" }}>

                <CardBody>

                    <Flex justifyContent={"space-between"}>


                        <VStack align="start" spacing={2}>

                            {/* Title */}
                            <Text color="gray.500" fontSize="17px">Total Revenue</Text>

                            {/* Value + Icon */}

                            <Text fontWeight="bold" fontSize="25px">{totalRevenue} EGP</Text>



                            {/* Sub text */}
                            {/* <Text color="rgb(69, 178, 137)" fontSize="14px">90% chef </Text>
                            <Text color="rgb(69, 178, 137)" fontSize="14px">10% platform </Text> */}

                        </VStack>
                       

                      <Box bg="rgb(231, 245, 236)" w="60px" h="60px" display="flex"
                            justifyContent="center" alignItems="center" borderRadius="10px">
                            < GiMoneyStack size="40px" color="rgb(22, 162, 73)" />
                        </Box>

                    </Flex>
                </CardBody>

            </Card.Root>


            {/* total orders */}
            <Card.Root bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                borderRadius="xl"
                py={"10px"}
                h="100%"
                border={"none"}
                shadow="sm"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.03)" }}>

                <CardBody>
                    <Flex justifyContent={"space-between"} alignItems={"center"} >


                        <VStack align="start" spacing={2}>

                            {/* Title */}
                            <Text color="gray.500" fontSize="17px">Total Orders</Text>

                            {/* Value + Icon */}

                            <Text fontWeight="bold" fontSize="25px">{totalOrders}</Text>



                            {/* Sub text */}
                            {/* <Text color="rgb(69, 178, 137)" fontSize="14px">+12.5% from last month</Text> */}

                        </VStack>



                        <Box bg="rgb(231, 245, 236)" w="60px" h="60px" display="flex"
                            justifyContent="center" alignItems="center" borderRadius="10px">
                            < HiShoppingBag size="40px" color="rgb(22, 162, 73)" />
                        </Box>

                    </Flex>


                </CardBody>

            </Card.Root>

            {/* Platform Profit*/}

            <Card.Root

                bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                borderRadius="xl"
                py={"10px"}
                h="100%"
                border={"none"}
                shadow="sm"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.03)" }}>

                <CardBody>
                    <Flex justifyContent={"space-between"}>


                        <VStack align="start" spacing={2}>

                            {/* Title */}
                            <Text color="gray.500" fontSize="17px">Platform Profit</Text>

                            {/* Value + Icon */}

                            <Text fontWeight="bold" fontSize="25px">{platformProfit} EGP</Text>



                            {/* Sub text */}
                            {/* <Text color="rgb(69, 178, 137)" fontSize="14px">+4.2% from last month</Text> */}

                        </VStack>

                        
                          <Box bg="rgb(231, 245, 236)" w="60px" h="60px" display="flex"
                            justifyContent="center" alignItems="center" borderRadius="10px">
                            < FaCoins size="40px" color="rgb(22, 162, 73)" />
                        </Box>

                        
                    </Flex>
                </CardBody>

            </Card.Root>









        </SimpleGrid>


    )
}
