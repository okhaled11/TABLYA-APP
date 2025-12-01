import { Box, Button, Flex, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

import { useDialog } from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode";
import colors from "../../../theme/color";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import CookerMenuCard from "../../../components/cooker/CookerMenuCard";
import { useGetMyMenuItemsQuery } from "../../../app/features/cooker/CookerMenuApi";
import MenuItemCardSkeleton from "../../../components/ui/MenuItemCardSkeleton";
import { MdRestaurantMenu } from "react-icons/md";
import AddMealModal from "../../../components/cooker/AddMealModal";
const CookerMenu = () => {
  const { colorMode } = useColorMode();
  const { data: items = [], isLoading, isError } = useGetMyMenuItemsQuery();
  const addMealDialog = useDialog();
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredItems = items.filter((item) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "in-stock") return item.available;
    if (filterStatus === "out-of-stock") return !item.available;
    return true;
  });

  return (
    <>
      <Flex py={6} my={5} justifyContent="space-between" alignItems="center">
        <Heading
          size="lg"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          mb={4}
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          My Menu
        </Heading>
        <Button
          bg={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          borderRadius="10px"
          _hover={{ opacity: 0.8 }}
          onClick={() => addMealDialog.setOpen(true)}
          color={"white"}
        >
          <FiPlus />
          Add Meal
        </Button>
      </Flex>

      <Flex
        mb={6}
        justify="center"
        bg={colorMode === "light" ? colors.light.bgThird: colors.dark.bgThird}
        p={1}
        borderRadius="full"
        width="fit-content"
        mx="auto"
      >
        {["all", "in-stock", "out-of-stock"].map((status) => (
          <Button
            key={status}
            onClick={() => setFilterStatus(status)}
            size="sm"
            variant={filterStatus === status ? "solid" : "ghost"}
            bg={
              filterStatus === status
                ? colorMode === "light"
                  ? colors.light.bgThird
                  : colors.dark.bgThird
                : "transparent"
            }
            color={
              filterStatus === status
                ? colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
                : colorMode === "light"
                ? "gray.500"
                : "gray.400"
            }
            borderRadius="full"
            px={6}
            _hover={{
              bg:
                filterStatus === status
                  ? colorMode === "light"
                    ? "white"
                    : "gray.700"
                  : colorMode === "light"
                  ? "gray.200"
                  : "gray.700",
            }}
            // boxShadow={filterStatus === status ? "sm" : "none"}
          >
            {status === "all"
              ? "All"
              : status === "in-stock"
              ? "In Stock"
              : "Out of Stock"}
          </Button>
        ))}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10} spacing={10}>
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <MenuItemCardSkeleton key={index} />
            ))}
          </>
        )}
        {isError && <Text color="red.400">Failed to load menu items.</Text>}
        {!isLoading && !isError && filteredItems.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={12}
            borderRadius="16px"
            bg={
              colorMode == "light"
                ? colors.light.bgFourth
                : colors.dark.bgFourth
            }
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
            gap={3}
            gridColumn={{ base: "1 / -1" }}
          >
            <Text fontSize={{ base: "4xl", md: "5xl" }} aria-hidden>
              <MdRestaurantMenu />
            </Text>
            <Heading
              size="md"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              No items found
            </Heading>
            <Text fontSize="sm">
              {filterStatus === "all"
                ? "Add your first meal to start your menu."
                : `No items found for ${filterStatus.replace("-", " ")}.`}
            </Text>
          </Flex>
        )}
        {!isLoading &&
          !isError &&
          filteredItems.map((item) => (
            <CookerMenuCard key={item.id} item={item} />
          ))}
      </SimpleGrid>

      <AddMealModal dialog={addMealDialog} />
    </>
  );
};

export default CookerMenu;
