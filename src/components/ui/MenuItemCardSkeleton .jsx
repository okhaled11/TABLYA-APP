import {
  Card,
  Flex,
  Skeleton,
  SkeletonText,
  IconButton,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const MenuItemCardSkeleton = () => {
  return (
    <Card.Root
      direction="row"
      overflow="hidden"
      cursor="pointer"
      maxW="100%"
      border="none"
      borderRadius="20px"
      p={3}
      justifyContent="center"
    >
      <Flex flex="1" direction="row">
        {/* Image Placeholder */}
        <Skeleton boxSize="90px" borderRadius="12px" />

        {/* Text & Button Placeholder */}
        <Flex ml={4} flex="1" direction="column">
          {/* Title Placeholder */}
          <Skeleton height="20px" width="70%" mb={2} />

          {/* Description Placeholder */}
          <SkeletonText mt="2" noOfLines={2} spacing="2" />

          {/* Price & Button */}
          <Flex justify="space-between" align="center" mt="auto" mb={1}>
            <Skeleton height="18px" width="50px" />

            <IconButton
              aria-label="Add to cart"
              icon={<FaShoppingCart />}
              size="sm"
              rounded="full"
              isDisabled
            />
          </Flex>
        </Flex>
      </Flex>
    </Card.Root>
  );
};

export default MenuItemCardSkeleton;
