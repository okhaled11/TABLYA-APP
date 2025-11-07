import { Flex, Text, Image, IconButton, HStack, Card } from "@chakra-ui/react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

export default function CartItemCard({ item, onRemove, onQuantityChange }) {
  const { colorMode } = useColorMode();
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
      <Flex flex="1" direction="row">
        {/* ---------- Image ---------- */}
        <Image
          src={item.menu_img}
          alt={item.title}
          boxSize="90px"
          objectFit="cover"
          borderRadius="12px"
        />

        {/* ---------- Content ---------- */}
        <Flex flex="1" direction="column" ml={4} justify="space-between">
          <Flex justify="space-between" align="flex-start" w="100%">
            <Text
              fontWeight="medium"
              fontSize="lg"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              noOfLines={1}
            >
              {item.title}
            </Text>

            <IconButton
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
              variant="ghost"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              size="sm"
            >
              <FiTrash2 />
            </IconButton>
          </Flex>

          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            noOfLines={2}
            mt={1}
          >
            {item.description}
          </Text>

          {/* ---------- Price & Quantity ---------- */}
          <Flex justify="space-between" align="center" mt={3}>
            <Text
              fontWeight="semibold"
              fontSize="md"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
            >
              ${item.price.toFixed(2)}
            </Text>

            <HStack px={3} py={1} spacing={2}>
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
    </Card.Root>
  );
}
