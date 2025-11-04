import React from 'react'
import { Box, SimpleGrid, Text, Card, CardBody, Container, VStack, Flex } from '@chakra-ui/react'
import { useColorMode } from "../../../theme/color-mode";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useGetUsersQuery } from '../../../app/features/UserSlice';
export default function Kpis() {

    const { colorMode } = useColorMode();

    const { data: users = [], isLoading } = useGetUsersQuery();
    return (
        <Container my={"30px"} mx="0px">


            <SimpleGrid columns={4} justifyContent={"center"} columnGap={"20px"} >
                {/* average order value */}
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
                            <Text color="gray.500" fontSize="15px">Average Order Value</Text>

                            {/* Value + Icon */}
                            <Flex justifyContent="space-between" w="100%" align="center">
                                <Text fontWeight="bold" fontSize="20px">$45.50</Text>
                                <Box bg="rgb(231, 245, 236)" w="40px" h="40px" display="flex"
                                    justifyContent="center" alignItems="center" borderRadius="10px">
                                    <BsCurrencyDollar size="30px" color="rgb(22, 162, 73)" />
                                </Box>
                            </Flex>

                            {/* Sub text */}
                            <Text color="rgb(69, 178, 137)" fontSize="14px">+12.5% from last month</Text>

                        </VStack>
                    </CardBody>

                </Card.Root>


                {/* growth rate */}

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
                            <Text color="gray.500" fontSize="15px">Growth Rate</Text>

                            {/* Value + Icon */}
                            <Flex justifyContent="space-between" w="100%" align="center">
                                <Text fontWeight="bold" fontSize="20px">23.4%</Text>
                                <Box bg="rgb(231, 245, 236)" w="40px" h="40px" display="flex"
                                    justifyContent="center" alignItems="center" borderRadius="10px">
                                    <FaArrowTrendUp size="30px" color="rgb(22, 162, 73)" />
                                </Box>
                            </Flex>

                            {/* Sub text */}
                            <Text color="rgb(69, 178, 137)" fontSize="14px">+4.2% from last month</Text>

                        </VStack>
                    </CardBody>

                </Card.Root>


                {/* new users */}

                <Card.Root bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                    borderRadius="xl"

                    h="100%"
                    border={"none"}
                    shadow="sm"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.03)" }} >

                    <CardBody>

                        <VStack align="start" spacing={2}>

                            {/* Title */}
                            <Text color="gray.500" fontSize="15px">New Users</Text>

                            {/* Value + Icon */}
                            <Flex justifyContent="space-between" w="100%" align="center">
                                <Text fontWeight="bold" fontSize="20px">{users.length}</Text>
                                <Box bg="rgb(231, 245, 236)" w="40px" h="40px" display="flex"
                                    justifyContent="center" alignItems="center" borderRadius="10px">
                                    <FiUsers
                                        size="30px" color="rgb(22, 162, 73)" />
                                </Box>
                            </Flex>

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
                            <Flex justifyContent="space-between" w="100%" align="center">
                                <Text fontWeight="bold" fontSize="20px">520</Text>
                                <Box bg="rgb(231, 245, 236)" w="40px" h="40px" display="flex"
                                    justifyContent="center" alignItems="center" borderRadius="10px">
                                    <FiShoppingCart
                                        size="30px" color="rgb(22, 162, 73)" />
                                </Box>
                            </Flex>

                            {/* Sub text */}
                            <Text color="rgb(69, 178, 137)" fontSize="14px">+12.5% from last month</Text>

                        </VStack>



                    </CardBody>

                </Card.Root>



            </SimpleGrid>


        </Container>


    )
}
