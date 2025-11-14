import React from 'react'
import { Box , Heading , Text } from '@chakra-ui/react' 
import RevenueSettings from '../../components/Admin/settings/RevenueSettings'
import colors from '../../theme/color'
import { useColorMode } from '../../theme/color-mode'
export default function Settings() {

  const {colorMode}= useColorMode();
  return (
   <Box  bg={colorMode ==="light" ? colors.light.bgMain : colors.dark.bgMain  } p={"30px"}>


  {/* heading title */}
       <Box>
            <Heading as="h1" fontWeight={"semibold"} fontSize={"28px"} my="3">Platform Settings</Heading>
            <Text fontSize={"18px"} color={"GrayText"}>
            Manage all platform-wide configuration values and system behavior
      
            </Text>
            </Box>


   {/* Revenue & Commission Settings  */}

   <Box my={"40px"} bg={colorMode ==="light" ? colors.light.bgMain : colors.dark.bgMain  }>
    <RevenueSettings/>
   </Box>
   </Box>
  )
}
