import {
  Flex,
  Text,
  Image,
  IconButton,
  HStack,
  Card,
  useDialog,
} from "@chakra-ui/react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { truncateText } from "../../utils";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { useTranslation } from "react-i18next";

export default function CartItemCard({ item, onRemove, onQuantityChange }) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const dialog = useDialog();
  const isMaxQuantity = item.quantity >= Number(item?.stock || 1);
  return (
    <Card.Root
      direction="row"
      overflow="hidden"
      cursor="pointer"
      maxW="100%"
      border="none"
      borderRadius="20px"
      p={3}
      // _hover={{ shadow: "md", transform: "scale(1.02)" }}
      // transition="0.2s ease"
      justifyContent="center"
      bg={colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth}
    >
      <Flex flex="1" direction="row" minW="0">
        {/* ---------- Image ---------- */}
        <Image
          src={item.menu_img}
          alt={item.title}
          boxSize={{ base: "72px", md: "90px" }}
          objectFit="cover"
          borderRadius="12px"
          flexShrink={0}
        />

        {/* ---------- Content ---------- */}
        <Flex
          flex="1"
          direction="column"
          ml={4}
          justify="space-between"
          minW="0"
        >
          <Flex
            justify="space-between"
            align="flex-start"
            w="100%"
            minW="0"
            gap={2}
          >
            <Text
              fontWeight="medium"
              fontSize={{ base: "md", md: "lg" }}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              noOfLines={1}
              overflowWrap="anywhere"
              wordBreak="break-word"
            >
              {truncateText(item.title, 20)}
            </Text>

            <IconButton
              onClick={() => dialog.setOpen(true)}
              aria-label="Remove item"
              variant="ghost"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              size="sm"
              flexShrink={0}
            >
              <FiTrash2 />
            </IconButton>
          </Flex>

          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            noOfLines={3}
            mt={1}
            overflowWrap="anywhere"
            wordBreak="break-word"
          >
            {truncateText(item.description, 200)}
          </Text>

          {/* ---------- Price & Quantity ---------- */}
          <Flex justify="space-between" align="center" mt={3} minW="0" gap={2}>
            <Text
              fontWeight="semibold"
              fontSize="md"
              whiteSpace="nowrap"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
            >
              {item.price_for_customer} L.E
            </Text>

            <HStack px={{ base: 2, md: 3 }} py={1} spacing={2} flexShrink={0}>
              <IconButton
                borderWidth="1px"
                borderRadius="10px"
                borderColor={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                _hover={
                  item.quantity > 1
                    ? {
                        bg:
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed,
                        color:
                          colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white,
                      }
                    : {}
                }
                transition="0.2s ease"
                size="xs"
                variant="ghost"
                onClick={() =>
                  item.quantity > 1 &&
                  onQuantityChange(item.id, item.quantity - 1)
                }
                aria-label="Decrease quantity"
                opacity={item.quantity > 1 ? 1 : 0.5}
                cursor={item.quantity > 1 ? "pointer" : "not-allowed"}
              >
                <FiMinus />
              </IconButton>

              <Text
                minW="24px"
                textAlign="center"
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {item.quantity}
              </Text>

              <IconButton
                borderWidth="1px"
                borderRadius="10px"
                borderColor={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color={
                  colorMode === "light" ? colors.light.white : colors.dark.white
                }
                _hover={
                  !isMaxQuantity
                    ? {
                        bg:
                          colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white,
                        color:
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed,
                      }
                    : {}
                }
                transition="0.2s ease"
                size="xs"
                variant="ghost"
                onClick={() =>
                  !isMaxQuantity && onQuantityChange(item.id, item.quantity + 1)
                }
                aria-label={
                  isMaxQuantity
                    ? "Maximum quantity reached"
                    : "Increase quantity"
                }
                opacity={isMaxQuantity ? 0.5 : 1}
                cursor={isMaxQuantity ? "not-allowed" : "pointer"}
              >
                <FiPlus />
              </IconButton>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      <CustomAlertDialog
        dialog={dialog}
        title={t("cart.remove") + "?"}
        description={`${t("cart.remove")} ${item.title}?`}
        cancelTxt={t("navbar.cancel")}
        okTxt={t("cart.remove")}
        onOkHandler={async () => {
          onRemove(item.id);
        }}
      />
    </Card.Root>
  );
}
