

import React, { useEffect, useState } from 'react';
import { supabase } from "../../../services/supabaseClient";
import { FaRegCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";
import { useGetAllCookerApprovalsQuery, useApproveCookerMutation, useRejectCookerApprovalMutation } from '../../../app/features/Admin/cookerApprovalsApi';
import { Button, Badge, Card, CardBody, HStack, Table, Dialog, CloseButton, Portal } from "@chakra-ui/react";
import { toaster } from '../../ui/toaster';

import { useDeleteCookerApprovalMutation } from '../../../app/features/Admin/cookerApprovalsApi';
import MariamCustomModal from './MariamModal';
import { FaUserXmark } from "react-icons/fa6";
import { useColorMode } from '../../../theme/color-mode';
import { Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Box } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { NativeSelect } from "@chakra-ui/react"
import { Spinner, VStack, Avatar } from "@chakra-ui/react"
import { useMemo } from 'react';
import { AiFillMessage } from "react-icons/ai";
import { useSendNotesMutation } from '../../../app/features/Admin/cookerApprovalsApi';

import colors from '../../../theme/color';
// import { useGetAdminIdQuery } from '../../../app/features/Admin/adminData';


export default function ChefTable() {


    const { colorMode } = useColorMode();
    const { data: cooker_approvals = [], isLoading } = useGetAllCookerApprovalsQuery();
    const [sendNotes] = useSendNotesMutation();
    const [approveCooker] = useApproveCookerMutation();
    const [deleteCookerApproval, { isLoading: isDeleting }] = useDeleteCookerApprovalMutation();
    const [rejectCookerApproval] = useRejectCookerApprovalMutation();

    // const {data :adminEmail ,isLoading: adminLoading }= useGetAdminIdQuery();
    // console.log (adminEmail);


    const [selectedCooker, setSelectedCooker] = useState(null);
    const [dialogType, setDialogType] = useState(""); // approve , reject ,details

    const [notes, setNotes] = useState("");
    const [isApproving, setIsApproving] = useState(false);

    const openDialog = (cooker, type) => {
        setSelectedCooker(cooker);
        setDialogType(type);
    };

    const closeDialog = () => {
        setSelectedCooker(null);
        setDialogType("");
    };

    ///***************************************************************************************** */
    //handling approve cooker
    const handleApproved = async () => {

        try {

            setIsApproving(true);
            await approveCooker({ id: selectedCooker.id }).unwrap();  //if there's an admin we have to write approve_by : adminEmail 

            // await refetch();
            toaster.create({
                title: "Update successful",
                description: `Cooker is added successfully `,
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Something went wrong",
                type: "error",
            });
        } finally {
            setIsApproving(false);
            closeDialog();
        }
    };


    /// handle delete btn (create toast )
    const handleDelete = async (id) => {
        try {
            await deleteCookerApproval({id: selectedCooker.id }).unwrap();
            toaster.create({
                title: "Deleted",
                description: "Cooker request deleted successfully",
                type: "success",
            });
           
        } catch (err) {
            toaster.create({
                title: "Error",
                description: "Failed to delete cooker request",
                type: "error",
            });
        }
        finally {
           
            closeDialog();
        }
    };

    //handle rejection 

    const handleReject = async (id) => {

        try {
            await rejectCookerApproval({ id: selectedCooker.id }).unwrap();
            toaster.create({
                title: "Rejected",
                description: `${selectedCooker.user?.name} has been rejected successfully`,
                type: "success",
            });
           
        } catch (err) {
            toaster.create({
                title: "Error",
                description: "Failed to reject cooker request",
                type: "error",
            });
        }

        finally {
            closeDialog();
        }
    };

    //handle send notes 
    const handleSendNotes = async () => {
        try {

            await sendNotes({ id: selectedCooker.id, notes }).unwrap();
            toaster.create({
                title: "Message sent",
                description: ` Notes have been sent to ${selectedCooker.user?.name} successfully`,
                type: "success",
            });

        } catch (err) {
            toaster.create({
                title: "Error",
                description: "Failed to send notes to the cooker ",
                type: "error",
            });

        } finally {
            setNotes("");
            closeDialog();
        }



    }


    const [statusFilter, setStatusFilter] = useState("all");
    const filteredCookers = useMemo(() => {                                 // usememo instead to prevent unnecessary renders 
        return statusFilter === "all"
            ? cooker_approvals
            : cooker_approvals.filter(cooker => cooker.status === statusFilter);
    }, [cooker_approvals, statusFilter]);


    //******************************************************************** */

    //pagination handling
    const itemsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCookers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCookers.length / itemsPerPage);



    return (
        <Card.Root borderRadius={"20px"} h="100%" border="none" shadow="sm" bg={colorMode === "light" ? "white" : colors.dark.bgThird} mt={"40px"} mb={"20px"}>

            <CardBody bg={colorMode === "light" ? "white" : colors.dark.bgThird} borderRadius={"40px"}>
                {/* filter by status */}
                <HStack spacing={4} mb={4} justifyContent="flex-end"  >
                    <Text>Filter by Status:</Text>

                    <NativeSelect.Root size="sm" width="240px"   >
                        <NativeSelect.Field value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                </HStack>






                <Table.Root size="lg" interactive >
                    <Table.Header stickyHeader>
                        <Table.Row bg={colorMode === "light" ? "rgb(255, 234, 233)" : colors.dark.bgSecond}>
                            <Table.ColumnHeader>Avatar</Table.ColumnHeader>
                            <Table.ColumnHeader>Seller Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Cuisine Type</Table.ColumnHeader>
                            <Table.ColumnHeader>Kitchen Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Submission Date</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>


                        {isLoading ? (


                            <Table.Row bg={colorMode === "dark" ? colors.dark.bgMain : ""} >
                                <Table.Cell colSpan={7} textAlign="center">
                                    <VStack colorPalette="teal">
                                        <Spinner color="colorPalette.600" />
                                        <Text color="colorPalette.600">Loading Cookers...</Text>
                                    </VStack>
                                </Table.Cell>
                            </Table.Row>

                        ) : (


                            currentItems.map((cooker) => (
                                <Table.Row key={cooker.id} bg={colorMode === "dark" ? colors.dark.bgMain : ""}>
                                    <Table.Cell>

                                        <Avatar.Root
                                            width={"80px"}
                                            height="80px"
                                            borderRadius="full"
                                            overflow="hidden"
                                            colorPalette={"red"}>
                                            
                                            <Avatar.Image src={cooker.user?.avatar_url} />
                                            <Avatar.Fallback name={cooker.user?.name} />
                                        </Avatar.Root>

                                    </Table.Cell>
                                    <Table.Cell>{cooker.user?.name}</Table.Cell>
                                    <Table.Cell>{cooker.cooker?.specialty || "—"}</Table.Cell>
                                    <Table.Cell>{cooker.cooker?.kitchen_name || "—"}</Table.Cell>
                                    <Table.Cell>{new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",

                                        hour12: true,
                                    }).format(new Date(cooker.applied_at))}</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            size={"lg"}
                                            px={"10px"}
                                            py={"8px"}
                                            borderRadius={"30px"}
                                            color={cooker.status === "pending" ? "rgb(245, 198, 58)" : cooker.status === "approved" ? "rgb(23, 163, 74)" : "rgb(239, 67, 67)"}
                                            background={cooker.status === "approved" ? colorMode === "light" ? " rgb(227, 240, 230)" : "rgb(25, 39, 2)" : cooker.status === "pending" ? colorMode === "light" ? "rgb(249, 243, 227)" : "rgb(67, 30, 8)" : colorMode === "light" ? "rgb(249, 231, 230)" : "rgb(66, 17, 12)"}
                                        >
                                            {cooker.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            {cooker.status === "pending" && (
                                                <>
                                                    {/* approve badge */}

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        borderWidth={"1px"}
                                                        borderColor={
                                                            colorMode === "light" ? "rgb(23, 163, 74)" : "green"
                                                        }
                                                        borderRadius={"10px"}
                                                        _hover={{ backgroundColor: "rgb(227, 240, 230)" }}
                                                        onClick={() => openDialog(cooker, "approve")}
                                                    >
                                                        <FaRegCheckCircle color="rgb(23, 163, 74)" />
                                                    </Button>

                                                    {/* reject badge */}


                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        borderWidth={"1px"}
                                                        borderColor={
                                                            colorMode === "light" ? "rgb(239, 67, 67)" : "red"
                                                        }
                                                        borderRadius={"10px"}
                                                        _hover={{ backgroundColor: "rgb(249, 231, 230)" }}
                                                        onClick={() => openDialog(cooker, "reject")}
                                                    >
                                                        <VscError color='rgb(239, 67, 67)' />
                                                    </Button>



                                                </>



                                            )}

                                            {/* detatils btn */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                borderWidth={"1px"}
                                                borderColor={
                                                    colorMode === "light" ? "rgb(245, 198, 58)" : "rgb(245, 198, 58)"
                                                }
                                                borderRadius={"10px"}
                                                _hover={{ backgroundColor: "rgb(249, 243, 227)" }}
                                                onClick={() => openDialog(cooker, "details")}
                                            >
                                                <MdErrorOutline  color='rgb(244, 192, 37)'/>
                                            </Button>



                                            {/* delete cooker btn */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                borderWidth={"1px"}
                                                borderColor={
                                                    colorMode === "light" ? "red.200" : "red.800"
                                                }
                                                borderRadius={"10px"}
                                                _hover={{ backgroundColor: "#f9e7e6" }}
                                                onClick={() => openDialog(cooker, "delete")}
                                            >
                                                <FaUserXmark color="red" />
                                            </Button>

                                            {/* send notes or message to the cooker */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="green"
                                                borderWidth={"1px"}
                                                borderColor={
                                                    colorMode === "light" ? "rgb(23, 163, 74)" : "green"
                                                }
                                                borderRadius={"10px"}
                                                _hover={{ backgroundColor: "rgb(227, 240, 230)" }}
                                                onClick={() => openDialog(cooker, "notes")}

                                            >
                                                <AiFillMessage color="green" />
                                            </Button>



                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))


                        )}

                    </Table.Body>
                </Table.Root>

                {/* pagination */}
                <Box mx={"auto"}>

                    <Pagination.Root
                        count={totalPages}
                        defaultPage={1}
                        onPageChange={(page) => setCurrentPage(page)}
                    >
                        <ButtonGroup variant="outline" size="sm" mt={4} justifyContent="center">
                            <Pagination.PrevTrigger asChild>
                                <IconButton icon={<LuChevronLeft />} />
                            </Pagination.PrevTrigger>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <IconButton
                                    key={i + 1}
                                    variant={currentPage === i + 1 ? "solid" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </IconButton>
                            ))}

                            <Pagination.NextTrigger asChild>
                                <IconButton icon={<LuChevronRight />} />
                            </Pagination.NextTrigger>
                        </ButtonGroup>
                    </Pagination.Root>

                </Box>




                {/* cutom modal for all actions  */}
                <MariamCustomModal
                    isOpen={!!dialogType}
                    onClose={closeDialog}
                    type={dialogType} // approve | reject | details | delete
                    cooker={selectedCooker}
                    onApprove={handleApproved}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    notes={notes}
                    setNotes={setNotes}
                    sendNotes={handleSendNotes}
                    isApproving={isApproving} //for loading btn
                />






            </CardBody>

        </Card.Root>


    );
}







