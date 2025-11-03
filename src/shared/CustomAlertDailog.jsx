import React from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

export default function CustomAlertDialog({
  dialog,
  title,
  description,
  cancelTxt = "Cancel",
  okTxt,
  onOkHandler,
  isLoading = false,
}) {
  return (
    <Dialog.RootProvider value={dialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{description}</Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelTxt}</Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="red"
                ml={3}
                onClick={async () => {
                  await onOkHandler();
                  dialog.setOpen(false);
                }}
                loading={isLoading}
              >
                {okTxt}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
