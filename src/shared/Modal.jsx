import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
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
  showFooter = true,
}) => {
  const { colorMode } = useColorMode();
  const { i18n } = useTranslation();

  return (
    <Dialog.RootProvider value={dialog} size={{ base: "sm", md: "lg" }}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            dir={i18n.dir()}
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
            {showFooter && (
              <Dialog.Footer>
                <Dialog.ActionTrigger
                  asChild
                  flex="1"
                  borderColor="red"
                  color="red"
                  borderRadius="12px"
                >
                  <Button variant="outline">{cancelTxt}</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  flex="1"
                  borderRadius="12px"
                  ms={3}
                  onClick={async () => {
                    try {
                      const ok = await onOkHandler();
                      if (ok === true) {
                        dialog.setOpen(false);
                      }
                    } catch (_) {
                      // keep modal open on errors
                    }
                  }}
                  loading={isLoading}
                >
                  {okTxt}
                </Button>
              </Dialog.Footer>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};

export default CustomModal;
