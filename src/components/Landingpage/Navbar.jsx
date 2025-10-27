import React, { useContext } from 'react'
import { Box, Flex, HStack, Image, Link, IconButton, Button, useDisclosure, Stack } from '@chakra-ui/react';
import logo from '../../assets/logotitle.png';

import { FiMoon, FiSun } from 'react-icons/fi';
import { useColorMode } from '../../theme/color-mode';

export default function Navbar() {

  const { colorMode, toggleColorMode } = useColorMode();




  return (
    <Box bg={'rgb(20, 4, 2)'} px={4} mx={20} borderRadius={20} mt={0} height={"70px"} >
      <Flex h="70px" alignItems="center" justifyContent={'space-between'}>
        {/* left : logo (lift aligned) */}
        <Box alignItems={"center"} flex={1} display={'flex'} justifyContent={'flex-start'}>
          <Image src={logo} alt='Tablya Logo' height={'40px'} />

        </Box>

        {/* middle : nav links (centered) */}
        <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={"center"}>

          <HStack

            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            <Link px={3} py={1} href={'#features'} fontSize={'lg'} color={'white'} _hover={{ bg: "rgb(43, 28, 26)", textDecoration: "none", borderRadius: "md" }} >Home</Link>
            <Link px={3} py={1} href={'#aboutus'} fontSize={'lg'} color={'white'} _hover={{ bg: "rgb(43, 28, 26)", textDecoration: "none", borderRadius: "md" }}>Features</Link>
            <Link px={3} py={1} href={'#contactus'} fontSize={'lg'} color={'white'} _hover={{ bg: "rgb(43, 28, 26)", textDecoration: "none", borderRadius: "md" }}>Reviews</Link>
          </HStack>


        </Box>
        <Box flex={1} display={'flex'} justifyContent={'flex-end'}>
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            aria-label={("navbar.toggle_mode")}
          >
            {colorMode === "light" ? <FiMoon color='white' /> : <FiSun />}
          </Button>


        </Box>



      </Flex>


    </Box>
  )
}
