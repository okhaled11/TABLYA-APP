import {
  Card,
  CardBody,
  Flex,
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

const CookerStaticsCardSkeleton = () => {
  const { colorMode } = useColorMode();

  return (
    <Card.Root
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="xl"
      h="100%"
      border="none"
      p={0}
    >
      <CardBody>
        <Flex direction="column" justifyContent="space-between">
          {/* Title skeleton */}
          <Skeleton
            height="18px"
            width="40%"
            mb={2}
            startColor={
              colorMode === "light"
                ? colors.light.textMain10a
                : colors.dark.textMain10a
            }
            endColor={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
          />

          {/* Divider */}
          <Box
            h="1px"
            w="100%"
            bg={
              colorMode === "light"
                ? colors.light.textMain10a
                : colors.dark.textMain10a
            }
            mb={3}
          ></Box>

          {/* Value + Icon */}
          <Flex justifyContent="space-between" align="center" mt={1} mb={3}>
            {/* Big value */}
            <Skeleton height="30px" width="30%" />

            {/* Icon box skeleton */}
            <SkeletonCircle size="10" />
          </Flex>

          {/* Subtext */}
          <Skeleton height="14px" width="60%" />
        </Flex>
      </CardBody>
    </Card.Root>
  );
};

export default CookerStaticsCardSkeleton;
