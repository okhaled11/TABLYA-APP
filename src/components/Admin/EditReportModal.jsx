
"use client";

import React, { useEffect } from "react";
import {
  Field,
  Input,
  Stack,
  NativeSelect,
  Textarea,
  Button,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useAddReportActionMutation } from "../../app/features/Admin/adminReportActionsApi";
import { useUpdateReportMutation } from "../../app/features/Admin/reportsApi";
import { toaster } from "../../components/ui/toaster";
const EditReportModal = ({ report, isOpen, onClose, adminId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      actionText: "",
      note: "",
      amount: "",
      status: report?.status || "open",
    },
  });

  const [addReportAction, { isLoading: isAdding }] =
    useAddReportActionMutation();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  useEffect(() => {
    if (report) {
      reset({
        actionText: "",
        note: "",
        amount: "",
        status: report.status || "open",
      });
    }
  }, [report, reset]);

 const onSubmit = async (data) => {
   if (!report) return;

   try {
     await addReportAction({
       report_id: report.id,
       by_user_id: adminId,
       action: data.actionText || `Status changed to ${data.status}`,
       note: data.note,
       amount: data.amount ? Number(data.amount) : null,
     }).unwrap();

     if (data.status && data.status !== report.status) {
       const updatedStatus = data.status.toLowerCase();

       await updateReport({
         id: report.id,
         updates: { status: updatedStatus, assigned_to_admin: adminId },
       }).unwrap();
     }

     // Show success toast
     toaster.create({
       title: "Report updated successfully!",
       type: "success",
     });

     onClose();
   } catch (err) {
     console.error("Error updating report:", err);

     // Show error toast
     toaster.create({
       title: "Failed to update report",
       description: err.message || "Check console for details",
       type: "error",
     });
   }
 };

  if (!report) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" shadow="lg" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Report: {report.id}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <Stack gap="6">
                {/* ACTION TEXT */}
                <Field.Root orientation="horizontal">
                  <Field.Label>Action</Field.Label>
                  <Input
                    placeholder="Describe the action"
                    flex="1"
                    {...register("actionText", {
                      required: "Action text is required",
                    })}
                  />
                </Field.Root>
                {errors.actionText && (
                  <p style={{ color: "red" }}>{errors.actionText.message}</p>
                )}

                {/* NOTE */}
                <Field.Root orientation="horizontal">
                  <Field.Label>Note (optional)</Field.Label>
                  <Textarea
                    placeholder="Add a note for this action"
                    flex="1"
                    {...register("note")}
                  />
                </Field.Root>

                {/* AMOUNT */}
                <Field.Root orientation="horizontal">
                  <Field.Label>Amount (optional)</Field.Label>
                  <Input
                    placeholder="Amount"
                    flex="1"
                    {...register("amount", {
                      validate: (value) =>
                        value === "" ||
                        !isNaN(Number(value)) ||
                        "Amount must be a number",
                    })}
                  />
                </Field.Root>
                {errors.amount && (
                  <p style={{ color: "red" }}>{errors.amount.message}</p>
                )}

                {/* STATUS */}
                <Field.Root orientation="horizontal">
                  <Field.Label>Update Status</Field.Label>
                  <NativeSelect.Root flex="1">
                    <NativeSelect.Field {...register("status", {
                      validate: (value) => value !== "" && value !== "open" || "Status is required, and cannot be open",
                    })}>
                      <option value="open">Open</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                {errors.status && (
                  <p style={{ color: "red" }}>{errors.status.message}</p>
                )}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>

              <Button
                colorScheme="blue"
                onClick={handleSubmit(onSubmit)}
                isDisabled={isAdding || isUpdating}
              >
                {isAdding || isUpdating ? <Spinner size="sm" /> : "Submit"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditReportModal;
