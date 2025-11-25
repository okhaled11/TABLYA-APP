import { Box, Flex, Text } from "@chakra-ui/react";
import { Select, Portal, createListCollection } from "@chakra-ui/react";
import MenuItemCard from "./MenuItemCard";
import { FiFilter } from "react-icons/fi";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useParams } from "react-router-dom";
import { useGetMenuItemsByCookerIdQuery } from "../../app/features/Customer/CookersApi";
import { useTranslation } from "react-i18next";
import MenuItemCardSkeleton from "../ui/MenuItemCardSkeleton";
import { useState } from "react";
import ScrollAreaComponent from "../ui/ScrollAreaComponent";

const ChefMenuSection = ({ isAvailable }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
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
      { label: t('menu.categories.all'), value: "all" },
      { label: t('menu.categories.mainDishes'), value: "main dishes" },
      { label: t('menu.categories.drinks'), value: "drinks" },
      { label: t('menu.categories.desserts'), value: "desserts" },
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
          fontSize="lg"
          fontWeight="bold"
          mb={4}
        >
          {t('menu.title')}
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
                  placeholder={t('menu.categories.allCategories')}
                  flex="1"
                  textAlign={isRTL ? 'right' : 'left'}
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
            <Text color="gray.500" fontSize="sm">
              {t('menu.noItems')}
            </Text>
        )}
      </ScrollAreaComponent>
    </Box>
  );
};

export default ChefMenuSection;
