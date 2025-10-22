import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay
          bg="blackAlpha.500"
          backdropFilter="blur(5px) hue-rotate(20deg)"
        />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              {btnClose}
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              onClick={onOkClick}
            >
              {txtOk}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
