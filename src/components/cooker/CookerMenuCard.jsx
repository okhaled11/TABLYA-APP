import {
  Flex,
  Text,
  Image,
  Card,
  Badge,
  Switch,
  Status,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import AddMealModal from "./AddMealModal";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
// import { useDispatch } from "react-redux";
import { useDialog } from "@chakra-ui/react";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { toaster } from "../../components/ui/toaster";
import { BsFillTrash3Fill } from "react-icons/bs";
import {
  // useUpdateMenuItemAvailabilityMutation,
  useDeleteMenuItemMutation,
} from "../../app/features/cooker/CookerMenuApi";

const CookerMenuCard = ({ item }) => {
  const { colorMode } = useColorMode();
  // const dispatch = useDispatch();
  const dialog = useDialog(); // delete dialog
  const editDialog = useDialog(); // edit modal dialog
  // const [updateAvailability, { isLoading: isToggling }] =
  //   useUpdateMenuItemAvailabilityMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

  // const handleAvailabilityChange = async (checked) => {
  //   const value = typeof checked === "object" && checked ? checked.checked : checked;
  //   try {
  //     await updateAvailability({ id: item.id, available: !!value }).unwrap();
  //     toaster.create({
  //       title: value ? "Meal enabled" : "Meal disabled",
  //       type: "success",
  //       duration: 2000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   } catch (e) {
  //     toaster.create({
  //       title: "Failed to update availability",
  //       description: e?.data?.message || e?.message,
  //       type: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   }
  // };

  return (
    <>
      <Card.Root
        direction="row"
        overflow="hidden"
        maxW="100%"
        w="100%"
        border="none"
        borderRadius="20px"
        p={{ base: 3, md: 3 }}
        // _hover={{ shadow: "md", transform: "scale(1.02)" }}
        // transition="0.2s ease"
        justifyContent="center"
        bg={
          colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
        }
      >
        <Flex flex="1" direction="row">
          <Image
            src={item?.menu_img || ""}
            alt="item-img"
            boxSize={{ base: "70px", md: "90px", lg: "110px" }}
            objectFit="cover"
            borderRadius="12px"
          />
          <Flex flex="1" direction="row" justifyContent="space-between">
            <Flex ml={4} direction="column" gap={3}>
              <Text
                fontWeight="medium"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                mb={1}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {item?.title || "No Title"}
              </Text>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight={{ base: "light", md: "medium" }}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                noOfLines={2}
              >
                {item?.description || "No Description Available"}
              </Text>
              <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
              >
                {item?.price ?? 0} L.E
              </Text>
            </Flex>
            <Flex
              direction="column"
              gap={3}
              justifyContent={{ base: "space-between", md: "space-around" }}
              alignItems="flex-end"
            >
              <Badge
                bg={
                  item?.available
                    ? colorMode === "light"
                      ? colors.light.success20a
                      : colors.dark.success20a
                    : colorMode === "light"
                    ? "#FFE5E5"
                    : "#4A2626"
                }
                borderRadius="8px"
                fontSize={{ base: "10px", md: "sm" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 0.5, md: 1 }}
                transition="all 0.3s ease"
              >
                <Flex gap={2} alignItems="center">
                  <Status.Root
                    display="flex"
                    colorPalette={item?.available ? "green" : "red"}
                    color={
                      item?.available
                        ? colorMode === "light"
                          ? colors.light.success
                          : colors.dark.success
                        : colorMode === "light"
                        ? "#DC2626"
                        : "#EF4444"
                    }
                  >
                    <Status.Indicator
                      bg={item?.available ? "green.400" : "red.400"}
                      boxShadow={
                        item?.available
                          ? "0 0 12px 2px #2EB200"
                          : "0 0 12px 2px #DC2626"
                      }
                      filter="blur(0.5px)"
                    />
                    {item?.available ? "in Stock" : "Out of Stock"}
                  </Status.Root>

                  {/* <Switch.Root
                   colorPalette={item?.available ? "green" : "green"}
                    checked={!!item?.available}
                    onCheckedChange={handleAvailabilityChange}
                    disabled={isToggling}
                    size="sm"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root> */}
                </Flex>
              </Badge>
              <Flex gap={5}>
                <FaPen
                  style={{ cursor: "pointer" }}
                  onClick={() => editDialog.setOpen(true)}
                />
                <BsFillTrash3Fill
                  fill="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => dialog.setOpen(true)}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card.Root>

      <CustomAlertDialog
        dialog={dialog}
        title={"Delete this item?"}
        description={"This action cannot be undone."}
        cancelTxt={"Cancel"}
        okTxt={"Delete"}
        onOkHandler={async () => {
          try {
            await deleteItem(item.id).unwrap();
            toaster.create({
              title: "Item deleted",
              type: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          } catch (e) {
            toaster.create({
              title: "Failed to delete item",
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
    </>
  );
};

export default CookerMenuCard;
