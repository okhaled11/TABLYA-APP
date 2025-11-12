import React from "react";
import {
  Button,
  Text,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogTrigger,
  DialogActionTrigger,
  DialogBackdrop,
} from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

function DialogCancelOrder({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  isLoading, 
  children
}) {
  const { colorMode } = useColorMode();

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={onOpenChange}
      placement="center"
      motionPreset="slide-in-bottom"
      closeOnInteractOutside={false}
      scrollBehavior="outside"
      blockScrollOnMount={false}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Backdrop with light blur */}
  

      <DialogContent
        maxW={{ base: "90%", md: "500px" }}
        w="full"
        bg={colorMode === "light" ? "white" : colors.dark.bgThird}
        rounded="xl"
        shadow="2xl"
        p={5}
        maxH="90vh"
        overflowY="auto"
        position="absolute"
        top="20%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1500}
      >
        <DialogHeader>
          <DialogTitle fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            Cancel Order?
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={
              colorMode === "light"
                ? colors.light.textSub
                : colors.dark.textSub
            }
          >
            Are you sure you want to cancel this order? This action cannot be undone.
          </Text>
        </DialogBody>

        <DialogFooter 
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
        >
          <DialogActionTrigger asChild>
            <Button 
              variant="outline" 
              mr={{ base: 0, md: 3 }}
              w={{ base: "full", md: "auto" }}
            >
              No, Keep Order
            </Button>
          </DialogActionTrigger>
          <Button
            bg={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            color="white"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Cancelling..."
            _hover={{ opacity: 0.8 }}
            w={{ base: "full", md: "auto" }}
          >
            Yes, Cancel Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default DialogCancelOrder;
