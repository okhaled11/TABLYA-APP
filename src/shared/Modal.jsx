import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import colors from "../theme/color";
import { useColorMode } from "../theme/color-mode";
const CustomModal = ({
  dialog,
  title,
  description,
  cancelTxt = "Cancel",
  okTxt = "Save",
  onOkHandler,
  isLoading = false,
  children,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Dialog.RootProvider value={dialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg={
              colorMode == "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            borderRadius="22px"
          >
            <Dialog.Header display="flex" flexDirection="column">
              <Dialog.Title
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {title}
              </Dialog.Title>
              <Dialog.Description
                color={
                  colorMode == "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                {description}
              </Dialog.Description>
            </Dialog.Header>
            <Box w="90%" m="1px auto" h="1px" bg={"gray.300"} mb={5} />
            <Dialog.Body>{children}</Dialog.Body>
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
            <Dialog.CloseTrigger asChild >
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};

export default CustomModal;
