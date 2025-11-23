import { Field, Text, Dialog, Portal, Button, Stack } from "@chakra-ui/react";

const ViewReportModal = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" shadow="lg" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Report Details: {report.id}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <Stack gap="6">
                <Field.Root orientation="horizontal">
                  <Field.Label>Reporter</Field.Label>
                  <Text>{report.reporter?.name}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Target ID</Field.Label>
                  <Text>{report.target_id}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Target</Field.Label>
                  <Text>{report.target_type}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Reason</Field.Label>
                  <Text>{report.reason}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Details</Field.Label>
                  <Text>{report.details || "-"}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Order ID</Field.Label>
                  <Text>{report.order_id || "-"}</Text>
                </Field.Root>

                <Field.Root orientation="horizontal">
                  <Field.Label>Status</Field.Label>
                  <Text>{report.status}</Text>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ViewReportModal;
