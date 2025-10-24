import {
  Button,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
} from "@chakra-ui/react";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  btnClose = "Cancel",
  txtOk,
  onOkClick,
  isLoading = false,
  children,
}) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center" motionPreset="slide-in-bottom">
      <DialogBackdrop bg="blackAlpha.500" backdropFilter="blur(5px) hue-rotate(20deg)" />
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>{children}</DialogBody>
        <DialogFooter>
          <Button mr={3} onClick={onClose}>
            {btnClose}
          </Button>
          <Button
            colorPalette="blue"
            loading={isLoading}
            onClick={onOkClick}
          >
            {txtOk}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CustomModal;
