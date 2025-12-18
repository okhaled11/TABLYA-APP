
import React from "react";
import { Dialog, Portal, CloseButton, Button } from "@chakra-ui/react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmColor = "red",
}) => {
  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose?.()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>{message}</p>
            </Dialog.Body>
            <Dialog.Footer>
              {/* <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  {cancelLabel}
                </Button>
              </Dialog.ActionTrigger> */}
              <Button colorPalette={confirmColor} onClick={onConfirm}>
                {confirmLabel}
              </Button>
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

export default ConfirmDialog;
