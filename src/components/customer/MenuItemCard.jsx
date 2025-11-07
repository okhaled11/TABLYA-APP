import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Card,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/Customer/CartSlice";
import { Link } from "react-router-dom";
const MenuItemCard = ({ item }) => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };
  return (
    <>
      <Card.Root
        as={Link}
        to={`/home/cookers/${item.cooker_id}/meals/${item.id}`}
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
        bg={
          colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
        }
      >
        <Flex flex="1" direction="row">
          <Image
            src={item.menu_img}
            alt="Caffe Latte"
            boxSize="90px"
            objectFit="cover"
            borderRadius="12px"
          />
          <Flex ml={4} flex="1" direction="column">
            <Text
              fontWeight="medium"
              fontSize="lg"
              mb={1}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {item.title || "No Title"}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="light"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              noOfLines={2}
            >
              {item.description || "No Description Available"}
            </Text>
            <Flex justify="space-between" align="center" mt="auto">
              <Text
                fontWeight="semibold"
                fontSize="md"
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
              >
                ${item.price?.toFixed(2)}
              </Text>
              <IconButton
                onClick={handleAddToCart}
                aria-label="Add to cart"
                colorScheme="teal"
                variant="outline"
                size="sm"
                rounded="full"
                _hover={{ scale: 1.05 }}
                transition="0.2s ease"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
              >
                <FaShoppingCart />
              </IconButton>
            </Flex>
          </Flex>
        </Flex>
      </Card.Root>
    </>
  );
};

export default MenuItemCard;
