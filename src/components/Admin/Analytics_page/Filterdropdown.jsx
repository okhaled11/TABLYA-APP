import React from 'react'
import { Menu } from "@chakra-ui/react"
import { Button } from '@chakra-ui/react'
import { Portal } from '@chakra-ui/react'
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Filterdropdown({ period, setPeriod }) {
  //for filtering kpis in dashboard (monthly , daily , weekly)
    return (
        <Menu.Root  >
            <Menu.Trigger asChild>
                <Button variant="outline" size="lg"

                    // w={"150px"}
                    borderRadius="md"
                    px={3}
                    py={1}
                    fontSize={"15px"}>
                    Filter by {period}
                    <MdKeyboardArrowDown />
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner   >
                    <Menu.Content
                        borderRadius="md"
                        bg="white"
                        shadow="md"
                        w="200px">
                        <Menu.Item py={2} _hover={{ bg: "rgb(22, 162, 73)" }} onClick={() => setPeriod("daily")}>Daily</Menu.Item>
                        <Menu.Item py={2} _hover={{ bg: "rgb(22, 162, 73)" }} onClick={() => setPeriod("weekly")}>Weekly</Menu.Item>
                        <Menu.Item py={2} _hover={{ bg: "rgb(22, 162, 73)" }} onClick={() => setPeriod("monthly")}>Monthly</Menu.Item>


                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}

