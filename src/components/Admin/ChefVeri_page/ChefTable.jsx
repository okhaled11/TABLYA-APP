import React from 'react'
import { supabase } from "../../../services/supabaseClient";


import { FaRegCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";
import { useGetCookerApprovalsQuery } from '../../../app/features/Admin/cookerApprovalsApi';
import { useApproveCookerMutation } from '../../../app/features/Admin/cookerApprovalsApi';
import { useState, useRef } from 'react';
import {

    Button,
    Badge,
    Card,
    CardBody,
    HStack,
    Table,
    Dialog,


} from "@chakra-ui/react";
import {

    CloseButton,

    Portal,
    useDisclosure


} from "@chakra-ui/react"

import { toaster } from '../../ui/toaster';
import colors from '../../../theme/color';




export default function ChefTable() {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: cooker_approvals = [], isLoading, error } = useGetCookerApprovalsQuery();
    const [approveCooker, { isLoading: isApproving }] = useApproveCookerMutation();

    const [selectedCooker, setSelectedCooker] = useState(null);

    const cancelRef = useRef();

    const handleApprovebtn = (cooker) => {

        setSelectedCooker(cooker);
        onOpen();

    }

    //handle alert approve dialog 

    const handleApproved = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {

                toaster.create({
                    title: "Not logged in !",
                    description:
                        "You must be logged in as an admin to approve a cooker.",
                    type: "warning"   

                });
                return;
            }

            
            await approveCooker({
                id: selectedCooker.id,
                approved_by: user.id, 
            }).unwrap();



            toaster.create({
                title: "Update successful",
                description: "File saved successfully to the server",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
                type:"success"
            })


        } catch (error) {

            toaster.create({
                title: "error ",
                description: "something wrong happening",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
             type: "error"
            })

        } finally {

            setSelectedCooker(null);
        }
    };



    return (
        <>

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
                                    <Table.Cell ><Badge color={cooker.status === "pending" ? "rgb(245, 198, 58)" : cooker.status === "approved" ? "rgb(23, 163, 74)" : "rgb(239, 67, 67)"}
                                        background={cooker.status === "pending" ? "rgb(249, 243, 227)" : cooker.status === "approved" ? "rgb(227, 240, 230)" : "rgb(249, 231, 230)"}>
                                        {cooker.status}
                                    </Badge> </Table.Cell>
                                    <Table.Cell >{cooker.status === "pending" ?

                                        <HStack>
                                           
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <Badge
                                                        size={"lg"}
                                                        cursor={"pointer"}
                                                        background={"white"}
                                                        border={"1px solid rgb(23, 163, 74)"}
                                                        borderRadius={"5px"}
                                                        onClick={() => setSelectedCooker(cooker)}
                                                    >
                                                        <FaRegCheckCircle color="rgb(23, 163, 74)" />
                                                    </Badge>
                                                </Dialog.Trigger>

                                                <Portal>
                                                    <Dialog.Backdrop />
                                                    <Dialog.Positioner>
                                                        <Dialog.Content>
                                                            <Dialog.Header>
                                                                <Dialog.Title>Confirm Approval</Dialog.Title>
                                                            </Dialog.Header>

                                                            <Dialog.Body>
                                                                Are you sure you want to approve{" "}
                                                                <b>{selectedCooker?.name} </b>to be part of our community?
                                                            </Dialog.Body>

                                                            <Dialog.Footer>
                                                                <Dialog.ActionTrigger asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </Dialog.ActionTrigger>
                                                                <Button onClick={handleApproved} background={colors.light.success}>Approve</Button>
                                                            </Dialog.Footer>

                                                            <Dialog.CloseTrigger asChild>
                                                                <CloseButton size="sm" />
                                                            </Dialog.CloseTrigger>
                                                        </Dialog.Content>
                                                    </Dialog.Positioner>
                                                </Portal>
                                            </Dialog.Root>
                                            {/* <Badge size={"lg"} cursor={"pointer"} onClick={()=>handleApprovebtn(cooker)}  background={"white"} border={ "1px solid rgb(23, 163, 74)"} borderRadius={"5px"}> <FaRegCheckCircle color='rgb(23, 163, 74)' /></Badge> */}
                                            <Badge size={"lg"} cursor={"pointer"} onClick={() => handleApprovebtn(cooker)} background={"white"} border={"1px solid rgb(239, 67, 67)"} borderRadius={"5px"}> <VscError color='rgb(239, 67, 67)' /> </Badge>
                                            <Badge size={"lg"} cursor={"pointer"} background={"white"} border={"1px solid "} borderRadius={"5px"}><MdErrorOutline /></Badge>

                                        </HStack>
                                        :
                                        <Badge size={"lg"} cursor={"pointer"} background={"white"} border={"1px solid "} borderRadius={"5px"}><MdErrorOutline /></Badge>
                                    }</Table.Cell>

                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>


                </CardBody>


            </Card.Root>


           

        </>
    )
}
