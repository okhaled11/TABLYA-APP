import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Textarea,
  Text,
  Flex,
  Grid,
  GridItem,
  Field,
  CloseButton,
  FileUpload,
  InputGroup,
} from "@chakra-ui/react";
import { Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { LuFileImage, LuFileUp } from "react-icons/lu";
import CustomModal from "../../shared/Modal";
import {
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} from "../../app/features/cooker/CookerMenuApi";
import { convertImageToWebP } from "../../services/imageToWebp";
import { toaster } from "../ui/toaster";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMealSchema } from "../../validation";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { PiForkKnifeFill, PiMoneyWavyFill } from "react-icons/pi";
import {
  MdDescription,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
const AddMealModal = ({ dialog, item = null, mode = "create" }) => {
  const { colorMode } = useColorMode();
  const [createMenuItem, { isLoading: isCreating }] =
    useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemMutation();
  const [imagePreview, setImagePreview] = useState(null);

  const isEditing = mode === "edit" && !!item;

  const categoryOptions = [
    { label: "main dishes", value: "main dishes" },
    { label: "drinks", value: "drinks" },
    { label: "desserts", value: "desserts" },
  ];

  const frameworks = createListCollection({
    items: categoryOptions,
  });

  const {
    register,
    control,
    setValue,
    reset,
    clearErrors,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addMealSchema, { context: { isEditing } }),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      preparation_time: "",
      image: undefined,
      isEditing,
    },
  });

  useEffect(() => {
    setValue("isEditing", isEditing, { shouldValidate: false });
    if (isEditing && item) {
      setValue("name", item.title || "");
      setValue("price", item.price ?? "");
      setValue("description", item.description || "");
      setValue("category", item.category || "");
      setValue("stock", item.stock ?? "");
      setValue("preparation_time", item.prep_time_minutes ?? "");
      setValue("image", undefined, { shouldValidate: false });
      setImagePreview(item.menu_img || null);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, item]);

  const handleImageChange = (e) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    setValue("image", file, { shouldValidate: false });
    if (file) {
      clearErrors("image");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      clearErrors("image");
      // keep existing preview in edit mode; clear in create mode
      setImagePreview(isEditing ? item?.menu_img || null : null);
    }
  };

  const onSubmit = async (data) => {
    try {
      let processedImage = data.image;
      if (data.image) {
        try {
          processedImage = await convertImageToWebP(data.image, {
            quality: 0.8,
            maxWidth: 1600,
            maxHeight: 1600,
          });
        } catch (_) {
          processedImage = data.image;
        }
      }

      const baseData = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        stock: parseInt(data.stock),
        preparation_time: parseInt(data.preparation_time),
      };

      const payload = isEditing
        ? data.image
          ? { id: item.id, ...baseData, image: processedImage }
          : { id: item.id, ...baseData }
        : { ...baseData, image: processedImage };

      if (isEditing) {
        await updateMenuItem(payload).unwrap();
        toaster.create({
          title: "Success",
          description: "Meal updated successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        await createMenuItem(payload).unwrap();
        toaster.create({
          title: "Success",
          description: "Meal added successfully!",
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }

      // Reset form only on success; modal will close based on return value
      reset();
      setImagePreview(null);
      return true;
    } catch (err) {
      toaster.create({
        title: "Error",
        description: err?.message || "Failed to add meal, Please try again",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return false;
    }
  };

  const handleOk = async () => {
    const isValid = await trigger();
    if (!isValid) return false;
    return await onSubmit(getValues());
  };

  return (
    <CustomModal
      dialog={dialog}
      title={isEditing ? "Edit Meal" : "Add Meal"}
      description={
        isEditing
          ? "Update the details of your meal."
          : "Fill in the details to add a new meal to your menu."
      }
      okTxt={isEditing ? "Save Changes" : "Add Meal"}
      cancelTxt="Cancel"
      onOkHandler={handleOk}
      isLoading={isCreating || isUpdating}
    >
      <Box p={4}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={4}>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Meal Name
              </Field.Label>
              <InputGroup startElement={<PiForkKnifeFill />}>
                <Input
                  {...register("name")}
                  placeholder="Enter meal name"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors?.name && (
                <Field.HelperText color={"crimson"}>
                  {errors?.name?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Meal Price (LE)
              </Field.Label>
              <InputGroup startElement={<PiMoneyWavyFill />}>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  placeholder="Enter meal price"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors?.price && (
                <Field.HelperText color={"crimson"}>
                  {errors?.price?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
        </Grid>

        <Box mb={4}>
          <Field.Root>
            <Field.Label
              fontWeight="medium"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              mb={2}
            >
              Meal Description
            </Field.Label>
            <InputGroup endElement={<MdDescription />}>
              <Textarea
                {...register("description")}
                placeholder="Describe your meal"
                rows={3}
                bg={
                  colorMode === "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </InputGroup>
            {errors?.description && (
              <Field.HelperText color={"crimson"}>
                {errors?.description?.message}
              </Field.HelperText>
            )}
          </Field.Root>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={4}>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Meal Image
              </Field.Label>

              <FileUpload.Root accept="image/*" gap="1" maxWidth="100%">
                <FileUpload.HiddenInput onChange={handleImageChange} />
                <InputGroup
                  startElement={<LuFileImage />}
                  endElement={
                    <FileUpload.ClearTrigger asChild>
                      <CloseButton
                        me="-1"
                        size="xs"
                        variant="plain"
                        focusVisibleRing="inside"
                        focusRingWidth="2px"
                        pointerEvents="auto"
                      />
                    </FileUpload.ClearTrigger>
                  }
                >
                  <Input
                    asChild
                    borderRadius="10px"
                    bg={
                      colorMode === "light"
                        ? colors.light.bgInput
                        : colors.dark.bgInput
                    }
                  >
                    <FileUpload.Trigger>
                      <FileUpload.FileText lineClamp={1} />
                    </FileUpload.Trigger>
                  </Input>
                </InputGroup>
              </FileUpload.Root>

              {errors?.image && (
                <Field.HelperText color={"crimson"}>
                  {errors?.image?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Meal Category
              </Field.Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    collection={frameworks}
                    size="sm"
                    value={field.value ? [field.value] : []}
                    onValueChange={({ value }) => {
                      field.onChange(
                        Array.isArray(value) ? value[0] ?? "" : value ?? ""
                      );
                      clearErrors("category");
                    }}
                  >
                    <Select.Control>
                      <Select.Trigger
                        px="3"
                        py="2"
                        bg={
                          colorMode == "light"
                            ? colors.light.textMain10a
                            : colors.dark.textMain10a
                        }
                        // color="white"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        gap="2"
                        w="100%"
                      >
                        <FiFilter />
                        <Select.ValueText
                          placeholder="Choose meal category"
                          flex="1"
                          textAlign="left"
                        />
                        <Select.Indicator />
                      </Select.Trigger>
                    </Select.Control>

                    <Portal>
                      <Select.Positioner zIndex={1700}>
                        <Select.Content
                          zIndex={1700}
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
                            <Select.Item
                              item={item}
                              key={item.value}
                              px="3"
                              py="2"
                            >
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              {errors?.category && (
                <Field.HelperText color={"crimson"}>
                  {errors?.category?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mb={4}>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                In Stock
              </Field.Label>
              <InputGroup startElement={<MdOutlineProductionQuantityLimits />}>
                <Input
                  {...register("stock", { valueAsNumber: true })}
                  type="number"
                  placeholder="Available quantity"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors?.stock && (
                <Field.HelperText color={"crimson"}>
                  {errors?.stock?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root>
              <Field.Label
                fontWeight="medium"
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Preparation Time (minutes)
              </Field.Label>
              <InputGroup startElement={<IoTimeOutline />}>
                <Input
                  {...register("preparation_time", { valueAsNumber: true })}
                  type="number"
                  placeholder="Time in minutes"
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors?.preparation_time && (
                <Field.HelperText color={"crimson"}>
                  {errors?.preparation_time?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </GridItem>
        </Grid>
      </Box>
    </CustomModal>
  );
};

export default AddMealModal;
