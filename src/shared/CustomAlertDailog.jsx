import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import colors from "../theme/color";
import { useColorMode } from "../theme/color-mode";
export default function CustomAlertDialog({
  dialog,
  title,
  description,
  cancelTxt = "Cancel",
  okTxt,
  onOkHandler,
  isLoading = false,
}) {
  const { colorMode } = useColorMode();
  const { i18n } = useTranslation();
  return (
    <Dialog.RootProvider value={dialog}>
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
            <Dialog.Header>
              <Dialog.Title
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {description}
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger
                asChild
                flex="1"
                colorPalette="red"
                borderRadius="12px"
              >
                <Button variant="solid">{cancelTxt}</Button>
              </Dialog.ActionTrigger>

              <Button
                borderColor="red"
                color="red"
                variant="outline"
                flex="1"
                borderRadius="12px"
                ms={3}
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
