import {
  Flex,
  Text,
  Image,
  Card,
  Badge,
  Switch,
  Status,
  Button,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa";
import AddMealModal from "./AddMealModal";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
// import { useDispatch } from "react-redux";
import { useDialog } from "@chakra-ui/react";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import CustomModal from "../../shared/Modal";
import { toaster } from "../../components/ui/toaster";
import { BsFillTrash3Fill } from "react-icons/bs";
import {
  // useUpdateMenuItemAvailabilityMutation,
  useDeleteMenuItemMutation,
} from "../../app/features/Cooker/CookerMenuApi";
import { truncateText } from "../../utils";

const CookerMenuCard = ({ item }) => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const dialog = useDialog(); // delete dialog
  const editDialog = useDialog(); // edit modal dialog
  const viewDialog = useDialog(); // view modal dialog
  // const [updateAvailability, { isLoading: isToggling }] =
  //   useUpdateMenuItemAvailabilityMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  return (
    <>
      <Card.Root
        position="relative"
        overflow="hidden"
        maxW="100%"
        w="100%"
        border="none"
        borderRadius="2xl"
        boxShadow="md"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "xl",
          cursor: "pointer",
        }}
        transition="all 0.3s ease"
        bg={
          colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
        }
        onClick={() => viewDialog.setOpen(true)}
      >
        <Box position="relative" w="100%" h="200px">
          <Image
            src={item?.menu_img || ""}
            alt="item-img"
            w="100%"
            h="100%"
            objectFit="cover"
          />
          <Badge
            position="absolute"
            top={3}
            right={3}
            bg={
              item?.available
                ? colorMode === "light"
                  ? "green.100"
                  : "green.900"
                : colorMode === "light"
                ? "red.100"
                : "red.900"
            }
            color={
              item?.available
                ? colorMode === "light"
                  ? "green.700"
                  : "green.200"
                : colorMode === "light"
                ? "red.700"
                : "red.200"
            }
            borderRadius="full"
            px={3}
            py={1}
            boxShadow="sm"
          >
            <Flex gap={1.5} alignItems="center">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={item?.available ? "green.500" : "red.500"}
              />
              <Text fontSize="xs" fontWeight="bold">
                {item?.available
                  ? t("cookerMenu.inStock")
                  : t("cookerMenu.outOfStock")}
              </Text>
            </Flex>
          </Badge>
        </Box>

        <Flex direction="column" p={4} gap={3}>
          <Flex justify="space-between" align="start" gap={2}>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              noOfLines={1}
            >
              {truncateText(item?.title, 15) || t("cookerMenu.noTitle")}
            </Text>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              whiteSpace="nowrap"
            >
              {item?.price ?? 0} {t("common.currency")}
            </Text>
          </Flex>

          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            noOfLines={2}
            minH="40px"
          >
            {truncateText(item?.description, 80) || t("cookerMenu.noDesc")}
          </Text>

          <Flex gap={3} mt={3}>
            <Button
              flex={1}
              size="md"
              variant="solid"
              bg={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              color="white"
              borderRadius="xl"
              fontWeight="semibold"
              _hover={{
                bg:
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed,
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s"
              onClick={(e) => {
                e.stopPropagation();
                editDialog.setOpen(true);
              }}
            >
              <FaPen size={14} style={{ marginRight: "8px" }} />{" "}
              {t("cookerMenu.editMeal")}
            </Button>
            <Button
              size="md"
              variant="subtle"
              colorPalette="red"
              bg={colorMode === "light" ? "red.50" : "red.900"}
              color="red.500"
              borderRadius="xl"
              px={4}
              _hover={{
                bg: "red.100",
                color: "red.600",
                transform: "translateY(-2px)",
                boxShadow: "sm",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.2s"
              onClick={(e) => {
                e.stopPropagation();
                dialog.setOpen(true);
              }}
              aria-label="Delete meal"
            >
              <BsFillTrash3Fill size={18} />
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      <CustomAlertDialog
        dialog={dialog}
        title={t("cookerMenu.deleteTitle")}
        description={t("cookerMenu.deleteDesc")}
        cancelTxt={t("cookerMenu.cancel")}
        okTxt={t("cookerMenu.delete")}
        onOkHandler={async () => {
          try {
            await deleteItem(item.id).unwrap();
            toaster.create({
              title: t("cookerMenu.itemDeleted"),
              type: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          } catch (e) {
            toaster.create({
              title: t("cookerMenu.deleteFailed"),
              description: e?.data?.message || e?.message,
              type: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }
        }}
        isLoading={isDeleting}
      />

      <AddMealModal dialog={editDialog} item={item} mode="edit" />

      {/* Show details */}
      <CustomModal
        dialog={viewDialog}
        title={item?.title || t("cookerMenu.mealDetails")}
        description={t("cookerMenu.mealDetails")}
        showFooter={false}
      >
        <Flex direction="column" gap={4}>
          <Image
            src={item?.menu_img || ""}
            alt="item-img"
            w="100%"
            h="180px"
            objectFit="cover"
            borderRadius="xl"
          />
          {/* <Flex justify="space-between" align="center" > */}
          <Text
            fontWeight="semibold"
            fontSize="xl"
            noOfLines={2}
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {item?.title}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          >
            {item?.price ?? 0} {t("common.currency")}
          </Text>
          {/* </Flex> */}
          <Flex gap={2} align="center">
            <Badge
              colorPalette={item?.available ? "green" : "red"}
              variant="solid"
              size="md"
            >
              {item?.available
                ? t("cookerMenu.inStock")
                : t("cookerMenu.outOfStock")}
            </Badge>
            {item?.stock !== undefined && (
              <Text fontSize="sm" color="gray.500">
                ({item.stock} {t("cookerMenu.left")})
              </Text>
            )}
          </Flex>
          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            {item?.description || t("cookerMenu.noDesc")}
          </Text>
        </Flex>
      </CustomModal>
    </>
  );
};

export default CookerMenuCard;
