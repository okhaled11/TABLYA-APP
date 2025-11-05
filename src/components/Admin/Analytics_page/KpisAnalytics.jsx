import React from 'react'
import { Box, SimpleGrid, Text, Card, CardBody, Container, VStack, Flex } from '@chakra-ui/react'
import { useColorMode } from "../../../theme/color-mode";




export default function KpisAnalytics() {

const { colorMode } = useColorMode();






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
                                
                                    <Text fontWeight="bold" fontSize="20px">$45.50</Text>
                                    
                                
    
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
                               
                                    <Text fontWeight="bold" fontSize="20px">520</Text>
                                    
                               
    
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
                                
                                    <Text fontWeight="bold" fontSize="20px">23.4%</Text>
                                    
                               
    
                                {/* Sub text */}
                                <Text color="rgb(69, 178, 137)" fontSize="14px">+4.2% from last month</Text>
    
                            </VStack>
                        </CardBody>
    
                    </Card.Root>
    
    
    
                  
    
    
    
    
    
                </SimpleGrid>
    
    
  )
}
