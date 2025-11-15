
"use client";

import React, { useState, useEffect } from "react";
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
import { useAddReportActionMutation } from "../../app/features/Admin/adminReportActionsApi";
import { useUpdateReportMutation } from "../../app/features/Admin/reportsApi";

const EditReportModal = ({ report, isOpen, onClose, adminId }) => {
  const [formData, setFormData] = useState({
    note: "",
    amount: "",
    status: report?.status || "open",
    actionText: "",
  });

  const [addReportAction, { isLoading: isAdding }] =
    useAddReportActionMutation();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  useEffect(() => {
    if (report) {
      setFormData({
        note: "",
        amount: "",
        status: report.status || "open",
        actionText: "",
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!report) return;

    try {
      
      console.log("Submitting report update:", report.id, formData);

     
      await addReportAction({
        report_id: report.id,
        by_user_id: adminId,
        action: formData.actionText || `Status changed to ${formData.status}`,
        note: formData.note,
        amount: formData.amount ? Number(formData.amount) : null,
      }).unwrap();

      
      if (formData.status && formData.status !== report.status) {
        const updatedStatus = formData.status.toLowerCase();

        const res = await updateReport({
          id: report.id,
          updates: { status: updatedStatus, assigned_to_admin: adminId },
        }).unwrap();

        console.log("Update result:", res);
      }

      alert("Report updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating report:", err);
      alert("Failed to update report. Check console for details.");
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
              <Dialog.Title>Edit Report: {report.id}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <Stack gap="6">
                <Field.Root orientation="horizontal">
                  <Field.Label>Action</Field.Label>
                  <Input
                    name="actionText"
                    value={formData.actionText}
                    onChange={handleChange}
                    placeholder="Describe the action"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Note (optional)</Field.Label>
                  <Textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Add a note for this action"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Amount (optional)</Field.Label>
                  <Input
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    flex="1"
                  />
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Update Status</Field.Label>
                  <NativeSelect.Root flex="1">
                    <NativeSelect.Field
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="open">Open</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
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
