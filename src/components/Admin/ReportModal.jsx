"use client";

import React from "react";
import {
  Field,
  Text,
  Dialog,
  Portal,
  Button,
  Stack,
  DataList,
  Badge,
  Avatar,
} from "@chakra-ui/react";

const ViewReportModal = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  const latestAction =
    report.report_actions && report.report_actions.length > 0
      ? report.report_actions[report.report_actions.length - 1]
      : null;

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
                {/* <Field.Root orientation="horizontal">
                  <Field.Label>Reporter</Field.Label>
                  <Text>{report.reporter?.name}</Text>
                </Field.Root> */}

                <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemLabel>Avatar</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Avatar.Root size="lg">
                        <Avatar.Image src={report.reporter?.avatar_url} />
                        <Avatar.Fallback name={report.reporter?.name} />
                      </Avatar.Root>
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Name</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {report.reporter?.name}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Email</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {report.reporter?.email}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Role</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Badge
                        colorPalette={
                          report.reporter?.role === "customer"
                            ? "orange"
                            : report.reporter?.role === "cooker"
                            ? "green"
                            : "blue"
                        }
                      >
                        {report.reporter?.role}
                      </Badge>
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Phone</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {report.reporter?.phone}
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Target ID</DataList.ItemLabel>
                    <DataList.ItemValue>{report.target_id}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Target</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {report.target_type}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Reason</DataList.ItemLabel>
                    <DataList.ItemValue>{report.reason}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Details</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {report.details || "No details Available"}
                    </DataList.ItemValue>
                  </DataList.Item>

                  {latestAction && (
                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.ItemLabel>Action</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {latestAction.action}
                        </DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Amount</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {latestAction.amount ?? "No Money refunded"}
                        </DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Note</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {latestAction.note || "No notes Available"}
                        </DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Admin</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {latestAction.admin?.users?.name ?? "—"}
                        </DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Date</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                          }).format(new Date(latestAction.at))}
                        </DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
                  )}

                  <DataList.Item>
                    <DataList.ItemLabel>Status</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Badge
                        colorPalette={
                          report.status === "open"
                            ? "orange"
                            : report.status === "resolved"
                            ? "green"
                            : "red"
                        }
                      >
                        {report.status}
                      </Badge>
                    </DataList.ItemValue>
                  </DataList.Item>
                </DataList.Root>

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
