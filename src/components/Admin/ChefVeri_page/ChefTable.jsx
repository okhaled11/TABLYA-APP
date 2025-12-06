
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

import { Input, InputGroup } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { Tooltip } from '../../ui/tooltip';
import { MdMailOutline } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineSearchCircle } from "react-icons/hi";


import colors from '../../../theme/color';
// import { useGetAdminIdQuery } from '../../../app/features/Admin/adminData';


export default function ChefTable() {


    const { colorMode } = useColorMode();
    const { data: cooker_approvals = [], isLoading } = useGetAllCookerApprovalsQuery();

    const [sendNotes] = useSendNotesMutation();
    const [approveCooker] = useApproveCookerMutation();
    const [deleteCookerApproval, { isLoading: isDeleting }] = useDeleteCookerApprovalMutation();
    const [rejectCookerApproval] = useRejectCookerApprovalMutation();
    const [searchQuery, setSearchQuery] = useState("");


    const [selectedCooker, setSelectedCooker] = useState(null);
    const [dialogType, setDialogType] = useState(""); // approve , reject ,details

    //handling remove rejectef cooker from the table after rejection
    const [localCookers, setLocalCookers] = useState([]);
    
    useEffect(() => {
        if (cooker_approvals.length > 0 && localCookers.length === 0) {
            setLocalCookers([...cooker_approvals]);
        }
    }, [cooker_approvals, localCookers.length]);



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
             
            toaster.create({
                
                description: `  Email of approval sent to ${selectedCooker.name} successfully   `,
                type: "success",
            });
            // await refetch();
            toaster.create({
                title: "Update successful",
                description: `${selectedCooker.name} is added successfully `,
                type: "success",
            });
            
            
            //update local state to change cooker status to approved
            setLocalCookers((prev) => prev.map(cooker => cooker.id === selectedCooker.id ? { ...cooker, status: "approved" } : cooker));

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
    // const handleDelete = async (id) => {
    //     try {
    //         await deleteCookerApproval({ id: selectedCooker.id }).unwrap();
    //         toaster.create({
    //             title: "Deleted",
    //             description: "Cooker request deleted successfully",
    //             type: "success",
    //         });
    //         //update local state to delete cooker from table 
    //         setLocalCookers((prev) => prev.filter(cooker => cooker.id !== selectedCooker.id));

    //     } catch (err) {
    //         toaster.create({
    //             title: "Error",
    //             description: "Failed to delete cooker request",
    //             type: "error",
    //         });
    //     }
    //     finally {

    //         closeDialog();

    //     }
    // };

    //handle rejection 

    const handleReject = async (id) => {

        try {
            await rejectCookerApproval({ id: selectedCooker.id }).unwrap();
            toaster.create({
                title: "Rejected",
                description: `${selectedCooker.name} has been rejected successfully`,
                type: "success",
            });

             toaster.create({
                
                description: `  Email of rejection sent to ${selectedCooker.name} successfully   `,
                type: "success",
            });
            setLocalCookers((prev) => prev.filter(cooker => cooker.id !== selectedCooker.id));

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
                description: ` Notes have been sent to ${selectedCooker.name} successfully `,
                type: "success",
            });

             toaster.create({
                
                description: `Email sent to ${selectedCooker.name} successfully`,
                type: "success",
            });


            setLocalCookers(prev =>
                prev.map(c =>
                    c.id === selectedCooker.id
                        ? { ...c, notes: notes, status: "pending" }
                        : c
                )
            );


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


    //filtering by status and search by name 
    const [statusFilter, setStatusFilter] = useState("all");
    const filteredCookers = useMemo(() => {
        return localCookers
            .filter(cooker => statusFilter === "all" || cooker.status === statusFilter)
            .filter(cooker =>
                cooker.user?.user_metadata?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
    }, [localCookers, statusFilter, searchQuery]);

    // reset page to 1 when filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, searchQuery, localCookers]);


    //******************************************************************** */

    //pagination handling
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCookers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCookers.length / itemsPerPage);


    function getPaginationPages(currentPage, totalPages, maxPages = 5) {
        const pages = [];

        if (totalPages <= maxPages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(currentPage - Math.floor(maxPages / 2), 1);
            let end = start + maxPages - 1;

            if (end > totalPages) {
                end = totalPages;
                start = end - maxPages + 1;
            }

            for (let i = start; i <= end; i++) pages.push(i);

            if (start > 1) pages.unshift("…");
            if (end < totalPages) pages.push("…");
        }

        return pages;
    }



    return (
        <Card.Root borderRadius={"20px"} h="100%" border="none" shadow="sm" bg={colorMode === "light" ? "white" : colors.dark.bgThird} mt={"40px"} mb={"20px"}>

            <CardBody bg={colorMode === "light" ? "white" : colors.dark.bgThird} borderRadius={"40px"}>
                {/* filter by status */}
                <HStack spacing={4} mb={4} justifyContent="flex-end"  >


                    {/* search input by name  */}
                    <InputGroup flex="1" startElement={<LuSearch />} >
                        <Input size={"md"} width={"400px"} placeholder="Search by name..." onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} />
                    </InputGroup>

                    {/* filter by status  */}
                    <Text>Filter by Status:</Text>

                    <NativeSelect.Root size="sm" width="240px"   >
                        <NativeSelect.Field value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="updated">Updated</option>
                            {/* <option value="rejected">Rejected</option> */}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>


                </HStack>


                <Table.Root size="lg" interactive >
                    <Table.Header stickyHeader>
                        <Table.Row bg={colorMode === "light" ? "rgb(255, 234, 233)" : colors.dark.bgSecond}>
                            <Table.ColumnHeader>Avatar</Table.ColumnHeader>
                            <Table.ColumnHeader>Seller Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Specialty</Table.ColumnHeader>
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

                        ) : cooker_approvals.length === 0 ? (
                            <Table.Row bg={colorMode === "dark" ? colors.dark.bgMain : ""}>
                                <Table.Cell colSpan={7} textAlign="center">
                                    <VStack py={16} gap={4}>
                                        <Box color={colorMode === "light" ? "gray.400" : "gray.500"}>
                                            <IoDocumentTextOutline size={100} />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="semibold" color={colorMode === "light" ? "gray.700" : "gray.300"}>
                                            No Seller Applications Yet
                                        </Text>
                                        <Text fontSize="md" color="gray.500" maxW="400px">
                                            There are no seller applications in the system. New applications will appear here.
                                        </Text>
                                    </VStack>
                                </Table.Cell>
                            </Table.Row>

                        ) : currentItems.length === 0 ? (
                            <Table.Row bg={colorMode === "dark" ? colors.dark.bgMain : ""}>
                                <Table.Cell colSpan={7} textAlign="center">
                                    <VStack py={16} gap={4}>
                                        <Box color={colorMode === "light" ? "gray.400" : "gray.500"}>
                                            <HiOutlineSearchCircle size={100} />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="semibold" color={colorMode === "light" ? "gray.700" : "gray.300"}>
                                            No Results Found
                                        </Text>
                                        <Text fontSize="md" color="gray.500" maxW="400px">
                                            {searchQuery
                                                ? `No sellers found matching "${searchQuery}"`
                                                : `No ${statusFilter} applications found`
                                            }
                                        </Text>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorScheme="gray"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setStatusFilter("all");
                                            }}
                                        >
                                            Clear Filters
                                            {/* TODO: add clear filters functionality */}

                                        </Button>
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

                                            <Avatar.Image src={cooker.user?.user_metadata?.avatar_url} />
                                            <Avatar.Fallback name={cooker.user?.name} />
                                        </Avatar.Root>

                                    </Table.Cell>
                                    <Table.Cell>{cooker.user?.user_metadata?.name}</Table.Cell>
                                    <Table.Cell>{cooker.specialty || "—"}</Table.Cell>
                                    <Table.Cell>{cooker.user?.user_metadata?.KitchenName || "—"}</Table.Cell>
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
                                            color={cooker.status === "pending" ? "rgb(245, 198, 58)" : cooker.status === "approved" ? "rgb(23, 163, 74)" : "purple"}
                                            background={cooker.status === "approved" ? colorMode === "light" ? " rgb(227, 240, 230)" : "rgb(25, 39, 2)" : cooker.status === "pending" ? colorMode === "light" ? "rgb(249, 243, 227)" : "rgb(67, 30, 8)" : colorMode === "light" ? "rgba(234, 211, 240, 1)" : "rgba(55, 9, 56, 1)"}
                                        >
                                            {cooker.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <HStack>
                                            {(cooker.status === "pending" || cooker.status === "updated") && (
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
                                                        {cooker.status === "pending" && cooker.notes ? <MdMarkEmailRead color="green" /> : <MdMailOutline color="green" />}
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
                                                <MdErrorOutline color='rgb(244, 192, 37)' />
                                            </Button>



                                            {/* delete cooker btn */}
                                            {/* <Button
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
                                            </Button> */}





                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))


                        )}

                    </Table.Body>
                </Table.Root>

                {/* pagination */}


                <Box mx={"auto"}>
                    <ButtonGroup variant="outline" size="sm" mt={4} justifyContent="center">
                        {/* left arrow */}
                        <IconButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}>
                            <LuChevronLeft />
                        </IconButton>

                        {/* number of pages */}
                        {getPaginationPages(currentPage, totalPages).map((page, i) =>
                            page === "…" ? (
                                <IconButton key={i} isDisabled>
                                    …
                                </IconButton>
                            ) : (
                                <IconButton
                                    key={i}
                                    variant={currentPage === page ? "solid" : "outline"}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </IconButton>
                            )
                        )}

                        {/* right arrow */}
                        <IconButton onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}>

                            <LuChevronRight />

                        </IconButton>


                    </ButtonGroup>
                </Box>



                {/* cutom modal for all actions  */}
                <MariamCustomModal
                    isOpen={!!dialogType}
                    onClose={closeDialog}
                    type={dialogType} // approve | reject | details | delete
                    cooker={selectedCooker}
                    onApprove={handleApproved}
                    onReject={handleReject}
                    // onDelete={handleDelete}
                    notes={notes}
                    setNotes={setNotes}
                    sendNotes={handleSendNotes}
                    isApproving={isApproving} //for loading btn
                />






            </CardBody>

        </Card.Root>


    );
}

















