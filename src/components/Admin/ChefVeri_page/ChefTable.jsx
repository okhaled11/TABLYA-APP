

import React, { useState } from 'react';
import { supabase } from "../../../services/supabaseClient";
import { FaRegCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";
import { useGetAllCookerApprovalsQuery, useApproveCookerMutation, useRejectCookerApprovalMutation } from '../../../app/features/Admin/cookerApprovalsApi';
import { Button, Badge, Card, CardBody, HStack, Table, Dialog, CloseButton, Portal } from "@chakra-ui/react";
import { toaster } from '../../ui/toaster';
import colors from '../../../theme/color';
import { useDeleteCookerApprovalMutation } from '../../../app/features/Admin/cookerApprovalsApi';
import CustomModal from '../../../shared/Modal';


export default function ChefTable() {

    const { data: cooker_approvals = [], refetch } = useGetAllCookerApprovalsQuery();
    const [approveCooker] = useApproveCookerMutation();
    const [deleteCookerApproval, { isLoading: isDeleting }] = useDeleteCookerApprovalMutation();
    const [rejectCookerApproval] = useRejectCookerApprovalMutation();

    const [selectedCooker, setSelectedCooker] = useState(null);
    const [dialogType, setDialogType] = useState(null); // 'approve' | 'details'

    const openApproveDialog = (cooker) => {
        setSelectedCooker(cooker);
        setDialogType('approve');
    };

    const openDetailsDialog = (cooker) => {
        setSelectedCooker(cooker);
        setDialogType('details');
    };

    const closeDialog = () => {
        setSelectedCooker(null);
        setDialogType(null);
    };

    const handleApproved = async () => {
        try {
            const dummyAdminId = "test-admin-id";
            await approveCooker({ id: selectedCooker.id, approved_by: dummyAdminId }).unwrap();

            await refetch();
            toaster.create({
                title: "Update successful",
                description: "File saved successfully to the server",
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Something went wrong",
                type: "error",
            });
        } finally {
            closeDialog();
        }
    };

    /// handle delete btn 
    const handleDelete = async (id) => {
        try {
            await deleteCookerApproval(id).unwrap();
            toaster.create({
                title: "Deleted",
                description: "Cooker approval (and cooker if existed) deleted successfully",
                type: "success",
            });
            refetch();
        } catch (err) {
            toaster.create({
                title: "Error",
                description: "Failed to delete cooker request",
                type: "error",
            });
        }
    };
    // handle reject 

    const handleReject = async () => {
        try {

            await rejectCookerApproval(id, notes);
            toaster.create({
                title: "rejected",
                description: "Cooker is rejected ",
                type: "success",

            });

        } catch (err) {

            toaster.create({

                title: "error",
                description: "failed to reject Cooker request",
                type: "error",
            });
        }


    }



    return (
        <Card.Root borderRadius="xl" h="100%" border="none" shadow="sm">
            <CardBody>
                <Table.Root size="lg" interactive>
                    <Table.Header stickyHeader>
                        <Table.Row>
                            <Table.ColumnHeader></Table.ColumnHeader>
                            <Table.ColumnHeader>Seller Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Cuisine Type</Table.ColumnHeader>
                            <Table.ColumnHeader>Kitchen Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Submission Date</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cooker_approvals.map((cooker) => (
                            <Table.Row key={cooker.id}>
                                <Table.Cell>
                                    <img
                                        src={cooker.user?.avatar_url || "https://via.placeholder.com/80"}
                                        alt={cooker.user?.name}
                                        style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px" }}
                                    />
                                </Table.Cell>
                                <Table.Cell>{cooker.user?.name}</Table.Cell>
                                <Table.Cell>{cooker.cooker?.specialty || "—"}</Table.Cell>
                                <Table.Cell>{cooker.cooker?.kitchen_name || "—"}</Table.Cell>
                                <Table.Cell>{cooker.applied_at}</Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        color={cooker.status === "pending" ? "rgb(245, 198, 58)" : cooker.status === "approved" ? "rgb(23, 163, 74)" : "rgb(239, 67, 67)"}
                                        background={cooker.status === "pending" ? "rgb(249, 243, 227)" : cooker.status === "approved" ? "rgb(227, 240, 230)" : "rgb(249, 231, 230)"}
                                    >
                                        {cooker.status}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <HStack>
                                        {cooker.status === "pending" && (
                                            <>
                                              {/* approve badge */}
                                                <Badge
                                                    size="lg"
                                                    cursor="pointer"
                                                    background="white"
                                                    border="1px solid rgb(23, 163, 74)"
                                                    borderRadius="5px"
                                                    onClick={() => openApproveDialog(cooker)}
                                                >
                                                    <FaRegCheckCircle color="rgb(23, 163, 74)" />
                                                </Badge>
                                                
                                                {/* reject badge */}

                                                <Badge onClick={() => {
                                                    setSelectedCooker(cooker);
                                                    setDialogType("reject");
                                                }} size={"lg"} cursor={"pointer"} background={"white"} border={"1px solid rgb(239, 67, 67)"} borderRadius={"5px"}> <VscError color='rgb(239, 67, 67)' /> </Badge>

                                            </>



                                        )}


                                        <Badge
                                            size="lg"
                                            cursor="pointer"
                                            background="white"
                                            border="1px solid"
                                            borderRadius="5px"
                                            onClick={() => openDetailsDialog(cooker)}
                                        >
                                            <MdErrorOutline />
                                        </Badge>
                                        <Button background={"red"} onClick={() => handleDelete(cooker.id)}>Delete</Button>
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>

                {/* Single Dialog for Approve or Details */}
                {/* {selectedCooker && dialogType && (
          <Dialog.Root open={true} onOpenChange={closeDialog}>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content maxW={dialogType === 'details' ? "600px" : "auto"}>
                  <Dialog.Header>
                    <Dialog.Title>
                      {dialogType === 'approve' ? "Confirm Approval" : "Cooker Details"}
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    {dialogType === 'approve' ? (
                      <>Are you sure you want to approve <b>{selectedCooker.user?.name}</b> to be part of our community?</>
                    ) : (
                      <>
                        <img
                          src={selectedCooker.user?.avatar_url || "https://via.placeholder.com/80"}
                          alt={selectedCooker.user?.name}
                          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px" }}
                        />
                        <p><b>Name:</b> {selectedCooker.user?.name || selectedCooker.name}</p>
                        <p><b>Email:</b> {selectedCooker.user?.email || "—"}</p>
                        <p><b>Phone:</b> {selectedCooker.user?.phone || "—"}</p>
                        <p><b>Specialty:</b> {selectedCooker.cooker?.specialty || "—"}</p>
                        <p><b>Status:</b> {selectedCooker.status}</p>
                        <p><b>Applied At:</b> {selectedCooker.applied_at}</p>
                        <hr style={{ margin: "15px 0" }} />
                        <p><b>ID Card Front:</b></p>
                        {selectedCooker.id_card_front_url && <img src={selectedCooker.id_card_front_url} width="100%" alt="Front" />}
                        <p><b>ID Card Back:</b></p>
                        {selectedCooker.id_card_back_url && <img src={selectedCooker.id_card_back_url} width="100%" alt="Back" />}
                        <p><b>Selfie with ID:</b></p>
                        {selectedCooker.selfie_with_id_url && <img src={selectedCooker.selfie_with_id_url} width="100%" alt="Selfie" />}
                      </>
                    )}
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant="outline" onClick={closeDialog}>Cancel / Close</Button>
                    {dialogType === 'approve' && (
                      <Button onClick={handleApproved} background={colors.light.success}>Approve</Button>
                    )}
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )} */}


               {/* USING CUSTOM MODAL INSTEAD */}

                {selectedCooker && dialogType === "approve" && (
                    <CustomModal
                        dialog={{ open: true, setOpen: closeDialog }}
                        title="Approve Cooker"
                        description={`Are you sure you want ${selectedCooker.user?.name} to be part of our community?`}
                        okTxt="Approve"
                        onOkHandler={handleApproved}
                    />
                )}

                {selectedCooker && dialogType === "reject" && (
                    <CustomModal
                        dialog={{ open: true, setOpen: closeDialog }}
                        title="Reject Cooker"
                        description={`Are you sure you want to reject ${selectedCooker.user?.name}?`}
                        okTxt="Reject"
                        onOkHandler={handleReject}
                    />
                )}

                {selectedCooker && dialogType === "delete" && (
                    <CustomModal
                        dialog={{ open: true, setOpen: closeDialog }}
                        title="Delete Cooker"
                        description={`Are you sure you want to delete ${selectedCooker.user?.name}?`}
                        okTxt="Delete"
                        onOkHandler={() => handleDelete(selectedCooker.id)}
                    />
                )}

                {selectedCooker && dialogType === "details" && (
                    <CustomModal
                        dialog={{ open: true, setOpen: closeDialog }}
                        title="Cooker Details"
                        description=""
                        okTxt="Close"
                        onOkHandler={closeDialog}
                    >
                        <>
                            <img
                                src={selectedCooker.user?.avatar_url || "https://via.placeholder.com/80"}
                                alt={selectedCooker.user?.name}
                                style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px" }}
                            />
                            <p><b>Name:</b> {selectedCooker.user?.name || selectedCooker.name}</p>
                            <p><b>Email:</b> {selectedCooker.user?.email || "—"}</p>
                            <p><b>Phone:</b> {selectedCooker.user?.phone || "—"}</p>
                            <p><b>Specialty:</b> {selectedCooker.cooker?.specialty || "—"}</p>
                            <p><b>Status:</b> {selectedCooker.status}</p>
                            <p><b>Applied At:</b> {selectedCooker.applied_at}</p>
                            <hr style={{ margin: "15px 0" }} />
                            <p><b>ID Card Front:</b></p>
                            {selectedCooker.id_card_front_url && <img src={selectedCooker.id_card_front_url} width="100%" alt="Front" />}
                            <p><b>ID Card Back:</b></p>
                            {selectedCooker.id_card_back_url && <img src={selectedCooker.id_card_back_url} width="100%" alt="Back" />}
                            <p><b>Selfie with ID:</b></p>
                            {selectedCooker.selfie_with_id_url && <img src={selectedCooker.selfie_with_id_url} width="100%" alt="Selfie" />}
                        </>
                    </CustomModal>
                )}

            </CardBody>
        </Card.Root>































    );
}







