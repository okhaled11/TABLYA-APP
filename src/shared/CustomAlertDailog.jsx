import React from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogActionTrigger,
  Button,
} from "@chakra-ui/react";

export default function CustomAlertDailog({
  isOpen,
  onClose,
  title,
  description,
  cancelTxt = "Cancel",
  okTxt,
  onOkHandler,
  isLoading = false,
}) {
  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()} 
      placement="center" 
      motionPreset="slide-in-bottom"
      role="alertdialog"
    >
      <DialogBackdrop
        bg="blackAlpha.500"
        backdropFilter="blur(5px) hue-rotate(20deg)"
      />

      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button onClick={onClose}>
              {cancelTxt}
            </Button>
          </DialogActionTrigger>
          <Button
            colorPalette="red"
            ml={3}
            onClick={onOkHandler}
            loading={isLoading}
          >
            {okTxt}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
