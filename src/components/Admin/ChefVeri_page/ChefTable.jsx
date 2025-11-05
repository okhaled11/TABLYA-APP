import React from 'react'
import { Badge, CardBody, HStack, Table , Button } from "@chakra-ui/react"

import { Card } from '@chakra-ui/react'
import { FaRegCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";
import {useGetCookersApprovalsQuery } from '../../../app/features/Admin/cookerSlice';




export default function ChefTable() {

     console.log(useGetCookersApprovalsQuery);

    const {data: cooker_approvals= [] , isLoading , error} = useGetCookersApprovalsQuery();


    // const items = [
    //     { name: cooker_approvals.name, cuisineType: "Laptop", documents: "Electronics", date: 999.99, status: "pending" },
    //     { name: 2, cuisineType: "Coffee Maker", documents: "Home Appliances", date: 49.99, status: "verified" },
    //     { name: 3, cuisineType: "Desk Chair", documents: "Furniture", date: 150.0, status: "pending" },
    //     { name: 4, cuisineType: "Smartphone", documents: "Electronics", date: 799.99, status: "rejected" },
    //     { name: 5, cuisineType: "Headphones", documents: "Accessories", date: 199.99, status: "rejected" },

    // ]



    return (

        <Card.Root

            borderRadius="xl"

            h="100%"
            border={"none"}
            shadow="sm">

            <CardBody>


                <Table.Root size="lg" interactive >
                    <Table.Header stickyHeader>
                        <Table.Row>
                            <Table.ColumnHeader>Seller Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Cuisine Type</Table.ColumnHeader>
                            <Table.ColumnHeader >Documents</Table.ColumnHeader>
                            <Table.ColumnHeader >Submission Date</Table.ColumnHeader>
                            <Table.ColumnHeader >Status</Table.ColumnHeader>
                            <Table.ColumnHeader >Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cooker_approvals.map((cooker) => (
                            <Table.Row key={cooker.id} my={"20px"}>
                                <Table.Cell>{cooker.name}</Table.Cell>
                                <Table.Cell>{cooker.specialty}</Table.Cell>
                                <Table.Cell >{cooker.documents}</Table.Cell>
                                <Table.Cell >{cooker.applied_at}</Table.Cell>
                                <Table.Cell ><Badge color={cooker.status === "pending" ? "rgb(245, 198, 58)": cooker.status === "approved" ? "rgb(23, 163, 74)" : "rgb(239, 67, 67)"}
                                 background={cooker.status === "pending" ? "rgb(249, 243, 227)" : cooker.status === "approved" ? "rgb(227, 240, 230)" : "rgb(249, 231, 230)" }>
                                    {cooker.status}
                                </Badge> </Table.Cell>
                                <Table.Cell >{cooker.status === "pending" ?
                                
                                <HStack>
                                    <Badge size={"lg"} cursor={"pointer"} background={"white"} border={ "1px solid rgb(23, 163, 74)"} borderRadius={"5px"}> <FaRegCheckCircle color='rgb(23, 163, 74)' /></Badge>
                                    <Badge size={"lg"} cursor={"pointer"} onClick={console.log ("hello")} background={"white"} border={ "1px solid rgb(239, 67, 67)"} borderRadius={"5px"}> <VscError color='rgb(239, 67, 67)' /> </Badge>
                                    <Badge size={"lg"} cursor={"pointer"} onClick={console.log ("hello")} background={"white"} border={ "1px solid "} borderRadius={"5px"}><MdErrorOutline  /></Badge>

                                </HStack>
                                :
                                 <Badge size={"lg"} cursor={"pointer"} onClick={console.log ("hello")} background={"white"} border={ "1px solid "} borderRadius={"5px"}><MdErrorOutline  /></Badge>
                            }</Table.Cell>

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>

            </CardBody>


        </Card.Root>
    )
}
