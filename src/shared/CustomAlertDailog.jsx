import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay
          bg="blackAlpha.500"
          backdropFilter="blur(5px) hue-rotate(20deg)"
        />

        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {cancelTxt}
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={onOkHandler}
              isLoading={isLoading}
            >
              {okTxt}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
