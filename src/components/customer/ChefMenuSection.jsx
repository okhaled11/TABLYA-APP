import { Box, Flex, Text } from "@chakra-ui/react";
import { Select, Portal, createListCollection } from "@chakra-ui/react";
import MenuItemCard from "./MenuItemCard";
import { FiFilter } from "react-icons/fi";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useParams } from "react-router-dom";
import { useGetMenuItemsByCookerIdQuery } from "../../app/features/Customer/CookersApi";
import MenuItemCardSkeleton from "../ui/MenuItemCardSkeleton";
import { useState } from "react";
import ScrollAreaComponent from "../ui/ScrollAreaComponent";

const ChefMenuSection = ({ isAvailable }) => {
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const { data: menuItems, isLoading: menuLoading } =
    useGetMenuItemsByCookerIdQuery(id);
  const [selectedCategory, setSelectedCategory] = useState("all");
  console.log("menu", menuItems);
  // handle Filtter -----------------
  const normalizedCategories = Array.isArray(selectedCategory)
    ? selectedCategory.map((item) => item.value || item)
    : [selectedCategory?.value || selectedCategory];

  const filteredMenuItems = normalizedCategories.includes("all")
    ? menuItems
    : menuItems.filter((item) =>
        normalizedCategories.includes(item.category?.toLowerCase())
      );

  const frameworks = createListCollection({
    items: [
      { label: "All", value: "all" },
      { label: "main dishes", value: "main dishes" },
      { label: "Drinks", value: "drinks" },
      { label: "Desserts", value: "desserts" },
    ],
  });

  return (
    <Box
      bg="white"
      borderRadius="20px"
      p={{ base: 4, md: 10 }}
      boxShadow="sm"
      overflow="hidden"
      border="none"
      mt={8}
      maxH="60vh"
      background={
        colorMode == "light" ? colors.light.bgThird : colors.dark.bgThird
      }
    >
      {/* Header with category selector */}
      <Flex
        direction="row"
        justifyContent="space-between"
        align="center"
        mb={3}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Avilable Menu
        </Text>
        <Box>
          <Select.Root
            collection={frameworks}
            size="sm"
            value={selectedCategory}
            onValueChange={(e) => setSelectedCategory(e.value)}
          >
            <Select.HiddenSelect />

            <Select.Control>
              <Select.Trigger
                px="3"
                py="2"
                bg={
                  colorMode == "light"
                    ? colors.light.bgFixed
                    : colors.dark.bgFixed
                }
                color="white"
                borderRadius="md"
                display="flex"
                alignItems="center"
                gap="2"
                w="180px"
              >
                {/* Left Icon */}
                <FiFilter />

                {/* Selected Text */}
                <Select.ValueText
                  placeholder="All Categories"
                  flex="1"
                  textAlign="left"
                />

                <Select.Indicator />
              </Select.Trigger>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content
                  bg={
                    colorMode == "light"
                      ? colors.light.bgFixed
                      : colors.dark.bgFixed
                  }
                  shadow="md"
                  borderRadius="md"
                  color={"white"}
                >
                  {frameworks.items.map((item) => (
                    <Select.Item item={item} key={item.value} px="3" py="2">
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
      </Flex>
      {/* divider */}
      <Box
        w="100%"
        h="2px"
        bg={
          colorMode == "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mt={3}
        mb={5}
      />

      {/* Scrollable content */}
      <ScrollAreaComponent>
        {menuLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <MenuItemCardSkeleton key={index} />
          ))
        ) : filteredMenuItems && filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} isAvailable={isAvailable} />
          ))
        ) : (
          <Text mt={8} textAlign="center">
            No available items.
          </Text>
        )}
      </ScrollAreaComponent>
    </Box>
  );
};

export default ChefMenuSection;
