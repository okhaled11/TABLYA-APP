
import React from "react";
import {
  Dialog, Portal, Button, CloseButton, Avatar,
  DataList,
} from "@chakra-ui/react";
import colors from "../../../theme/color";
import { useState } from "react";
import { Textarea } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

const MariamCustomModal = ({
  isOpen,
  onClose,
  type,
  cooker,
  onApprove,
  onReject,
  onDelete,
  notes,
  setNotes
}) => {
  if (!isOpen || !cooker || !type) return null;

  const isApprove = type === "approve";
  const isReject = type === "reject";
  const isDetails = type === "details";
  const isDelete = type === "delete";
  const [previewImage, setPreviewImage] = useState(null);
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={isDetails ? "600px" : "auto"}>
            <Dialog.Header>
              <Dialog.Title>
                {isApprove
                  ? "Confirm Approval"
                  : isReject
                    ? "Reject Cooker"
                    : isDelete
                      ? "Delete Cooker"
                      : "Cooker Details"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {isApprove && (
                <>

                  <Text fontSize={"md"} >
                    Are you sure you want to approve{" "} <b>{cooker.user?.name}</b> to be part of our community?
                  </Text>

                </>
              )}

              {isReject && (
                <>
                  <VStack align="stretch" spacing={4} mt={4}>
                    <Text >
                      Are you sure you want to reject <b>{cooker.user?.name}</b> from joining our community?
                    </Text>

                    <Textarea
                      placeholder="Enter rejection notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      size="lg"
                      minH="120px"
                      resize="vertical"
                      mt={"30px"}
                    />
                  </VStack>
                </>
              )}

              {isDelete && (
                <>


                  <VStack align="stretch" spacing={4} >
                    <Text fontSize={"md"} >
                      This action will permanently remove{" "} <b>{cooker.user?.name}</b> from both approvals and users list.
                    </Text>
                    <Text fontSize={"md"}> <b> Are you sure you want to proceed? </b></Text>

                  </VStack>

                </>
              )}


              {isDetails && (
                <>
                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel>Avatar</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Avatar.Root size="80px">
                          <Avatar.Image src={cooker.user?.avatar_url} />
                          <Avatar.Fallback name={cooker.user?.name} />
                        </Avatar.Root>
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Name</DataList.ItemLabel>
                      <DataList.ItemValue>{cooker.user?.name || cooker.name}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Email</DataList.ItemLabel>
                      <DataList.ItemValue>{cooker.user?.email || "—"}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Phone</DataList.ItemLabel>
                      <DataList.ItemValue>{cooker.user?.phone || "—"}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Specialty</DataList.ItemLabel>
                      <DataList.ItemValue>{cooker.cooker?.specialty || "—"}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>{cooker.status}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Applied At</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }).format(new Date(cooker.applied_at))}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>

                  <hr style={{ margin: "15px 0" }} />

                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel>ID Card Front</DataList.ItemLabel>
                      <DataList.ItemValue cursor="pointer">
                        {cooker.id_card_front_url ? (
                          <img
                            src={cooker.id_card_front_url}
                            alt="ID Front"
                            width="150"
                            style={{ borderRadius: "8px" }}
                            onClick={() => setPreviewImage(cooker.id_card_back_url)}

                          />
                        ) : (
                          "—"
                        )}
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>ID Card Back</DataList.ItemLabel>
                      <DataList.ItemValue cursor="pointer">
                        {cooker.id_card_back_url ? (
                          <img

                            src={cooker.id_card_back_url}
                            alt="ID Back"
                            width="150"
                            style={{ borderRadius: "8px" }}
                            onClick={() => setPreviewImage(cooker.id_card_back_url)}
                          />
                        ) : (
                          "—"
                        )}
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Selfie with ID</DataList.ItemLabel>
                      <DataList.ItemValue cursor="pointer">
                        {cooker.selfie_with_id_url ? (
                          <img
                            src={cooker.selfie_with_id_url}
                            alt="Selfie"
                            width="150"
                            style={{ borderRadius: "8px" }}
                            onClick={() => setPreviewImage(cooker.selfie_with_id_url)}
                          />
                        ) : (
                          "—"
                        )}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </>
              )}


              {/* on click of id photos big modal is opend for preview image  */}
              {previewImage && (
                <Dialog.Root open={true} onOpenChange={() => setPreviewImage(null)}>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content maxW="80vw">
                      <Dialog.Header>
                        <Dialog.Title>Preview Image</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton />
                        </Dialog.CloseTrigger>
                      </Dialog.Header>
                      <Dialog.Body>
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            width: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                        />
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Button variant="outline" onClick={() => setPreviewImage(null)}>
                          Close
                        </Button>
                      </Dialog.Footer>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Dialog.Root>
              )}


            </Dialog.Body>


            {/* dialog footer btns */}
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancel / Close
              </Button>

              {isApprove && (
                <Button onClick={onApprove} background={colors.light.success}>
                  Approve
                </Button>
              )}

              {isReject && (
                <Button onClick={onReject} background={colors.light.error}>
                  Reject
                </Button>
              )}

              {isDelete && (
                <Button onClick={onDelete} background="red">
                  Delete
                </Button>
              )}
            </Dialog.Footer>




            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MariamCustomModal;





