import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useDialog } from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode";
import colors from "../../../theme/color";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import CookerMenuCard from "../../../components/cooker/CookerMenuCard";
import { useGetMyMenuItemsQuery } from "../../../app/features/Cooker/CookerMenuApi";
import MenuItemCardSkeleton from "../../../components/ui/MenuItemCardSkeleton";
import { MdRestaurantMenu } from "react-icons/md";
import AddMealModal from "../../../components/cooker/AddMealModal";
const CookerMenu = () => {
  const { colorMode } = useColorMode();
  const { data: items = [], isLoading, isError } = useGetMyMenuItemsQuery();
  const addMealDialog = useDialog();

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
      <Flex direction="column" gap={4}>
        {isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <MenuItemCardSkeleton key={index} />
            ))}
          </>
        )}
        {isError && <Text color="red.400">Failed to load menu items.</Text>}
        {!isLoading && !isError && items.length === 0 && (
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
              No items yet
            </Heading>
            <Text fontSize="sm">Add your first meal to start your menu.</Text>
          </Flex>
        )}
        {!isLoading &&
          !isError &&
          items.map((item) => <CookerMenuCard key={item.id} item={item} />)}
      </Flex>

      <AddMealModal dialog={addMealDialog} />
    </>
  );
};

export default CookerMenu;
