import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  Dialog,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { Select, Portal, createListCollection } from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { LuFileImage, LuFileUp } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
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
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { detectLang } from "../../utils";
import { useGetPlatformSettingsQuery } from "../../app/features/Admin/MariamSettings";

const AddMealModal = ({ dialog, item = null, mode = "create" }) => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const [createMenuItem, { isLoading: isCreating }] =
    useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageCheckPending, setImageCheckPending] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [descGenerating, setDescGenerating] = useState(false);

  const isEditing = mode === "edit" && !!item;

  const categoryOptions = [
    { label: t("addMeal.categories.mainDishes"), value: "main dishes" },
    { label: t("addMeal.categories.drinks"), value: "drinks" },
    { label: t("addMeal.categories.desserts"), value: "desserts" },
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
    watch,
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

  const descValue = watch("description");
  const isDescEmpty = !descValue || descValue.trim().length === 0;

  const priceValue = watch("price");
  const { data: settings } = useGetPlatformSettingsQuery();
  const feePct = Number(settings?.chef_fee_pct ?? settings?.chef_commission_pct ?? 0);
  const chefEarnings = Number(priceValue || 0) * (1 - feePct / 100);

  const handleImageChange = (e) => {
    const file =
      e.target.files && e.target.files[0] ? e.target.files[0] : undefined;
    setValue("image", file, { shouldValidate: false });

    const proceedPreview = (f) => {
      if (f) {
        clearErrors("image");
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(f);
      } else {
        clearErrors("image");
        setImagePreview(isEditing ? item?.menu_img || null : null);
      }
    };

    if (!file) {
      proceedPreview(undefined);
      return;
    }

    (async () => {
      try {
        setImageCheckPending(true);
        const ok = await validateImageWithGemini(file);
        if (!ok) {
          setValue("image", undefined, { shouldValidate: true });
          setImagePreview(isEditing ? item?.menu_img || null : null);
          setWarningText(
            t("addMeal.imageNotPermittedDesc")
          );
          setWarningOpen(true);
        } else {
          proceedPreview(file);
        }
      } catch (err) {
        toaster.create({
          title: t("addMeal.imageCheckFailed"),
          description:
            err?.message || t("addMeal.imageCheckFailedDesc"),
          type: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setValue("image", undefined, { shouldValidate: true });
        setImagePreview(isEditing ? item?.menu_img || null : null);
      } finally {
        setImageCheckPending(false);
      }
    })();
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(",")[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const validateImageWithGemini = async (file) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        "is _food": { type: SchemaType.BOOLEAN },
        Is_NSFW: { type: SchemaType.BOOLEAN },
      },
      required: ["is _food", "Is_NSFW"],
    };

    const base64 = await readFileAsBase64(file);

    const prompt =
      "You are an image safety and categorization assistant. Determine if the image is a food item and whether it contains any NSFW content. Respond ONLY with valid JSON that matches the provided schema.";

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: base64, mimeType: file.type } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0,
      },
    });

    const text = await result.response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      return false;
    }

    const isFood = parsed?.["is _food"] === true;
    const isNSFW = parsed?.["Is_NSFW"] === true;

    return isFood && !isNSFW;
  };

  // const detectLang = detectLang(text);

  const generateDescriptionFromTitle = async (title) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const lang = detectLang(title);
    const prompt =
      lang === "ar"
        ? `اكتب وصفًا قصيرًا من 1-3 جملة لطبق بعنوان: "${title}". اجعله بسيطًا وجذابًا يناسب قائمة منزلية، يبرز النكهات والمكونات الشائعة بدون أسعار أو ادعاءات صحية أو إيموجي.`
        : `Write a short 1-3 sentence description for a dish titled: "${title}". Keep it simple and enticing for a home-cooked menu. Highlight flavors and common ingredients. No prices, health claims, or emojis.`;
    try {
      const result = await model.generateContent(prompt);
      const out = (await result.response.text())?.trim();
      const cleaned = out
        ?.replace(/^"+|"+$/g, "")
        .replace(/^`+|`+$/g, "")
        .trim();
      return cleaned || "";
    } catch (err) {
      console.warn("Gemini text generation failed:", err);
      return "";
    }
  };

  const handleDescriptionGenerateClick = async () => {
    try {
      setDescGenerating(true);
      const title = getValues("name")?.trim();
      if (!title) {
        toaster.create({
          title: t("addMeal.addNameFirst"),
          description: t("addMeal.addNameFirstDesc"),
          type: "warning",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        return;
      }
      const currentDesc = getValues("description")?.trim();
      let desc = await generateDescriptionFromTitle(title);
      if (!desc) {
        const lang = detectLang(title);
        desc =
          lang === "ar"
            ? `طبق ${title} يتميز بمذاق شهي ومكونات بسيطة، مناسب للتقديم المنزلي.`
            : `${title} features a tasty, home-style flavor with simple ingredients.`;
      }
      if (!currentDesc || currentDesc.length === 0) {
        setValue("description", desc, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        await trigger("description");
      }
    } catch (e) {
      toaster.create({
        title: t("addMeal.generateFailed"),
        description: e?.message || t("addMeal.errorDesc"),
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setDescGenerating(false);
    }
  };

  const handleNameBlur = async () => {
    const title = getValues("name")?.trim();
    const currentDesc = getValues("description")?.trim();
    if (!title || currentDesc) return;
    const desc = await generateDescriptionFromTitle(title);
    if (desc) {
      setValue("description", desc, {
        shouldValidate: true,
        shouldDirty: true,
      });
      await trigger("description");
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
          title: t("addMeal.successEdit"), // Success
          description: t("addMeal.successEdit"), // Using same message for title/desc for now or fix keys
// Actually I defined successAdd and successEdit separately
          title: "Success",
          description: t("addMeal.successEdit"),
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        await createMenuItem(payload).unwrap();
        toaster.create({
          title: "Success",
          description: t("addMeal.successAdd"),
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
        title: t("addMeal.error"),
        description: err?.message || t("addMeal.errorDesc"),
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
    <>
      <CustomModal
        dialog={dialog}
        title={isEditing ? t("addMeal.titleEdit") : t("addMeal.titleAdd")}
        description={
          isEditing
            ? t("addMeal.descEdit")
            : t("addMeal.descAdd")
        }
        okTxt={isEditing ? t("addMeal.save") : t("addMeal.add")}
        cancelTxt={t("addMeal.cancel")}
        onOkHandler={handleOk}
        isLoading={isCreating || isUpdating || imageCheckPending}
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
                  {t("addMeal.mealName")}
                </Field.Label>
                <InputGroup startElement={<PiForkKnifeFill />}>
                  <Input
                    {...register("name", { onBlur: handleNameBlur })}
                    placeholder={t("addMeal.mealNamePlaceholder")}
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
                  {t("addMeal.mealPrice")}
                </Field.Label>
                <InputGroup startElement={<PiMoneyWavyFill />}>
                  <Input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    placeholder={t("addMeal.mealPricePlaceholder")}
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
                <Text
                  mt={1}
                  fontSize="sm"
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                >
                  {t("addMeal.chefEarn", {
                    amount: Number.isFinite(chefEarnings) ? chefEarnings.toFixed(2) : "0.00",
                    feeText: feePct ? t("addMeal.feeText", { fee: feePct }) : ""
                  })}
                </Text>
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
                {t("addMeal.mealDesc")}
              </Field.Label>
              <InputGroup
                endElement={
                  descGenerating ? (
                    <Spinner size="sm" />
                  ) : isDescEmpty ? (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={handleDescriptionGenerateClick}
                      title={t("addMeal.generateDesc")}
                      border="1px solid gray"
                    >
                      {t("addMeal.generateDesc")}
                      <MdDescription />
                    </Button>
                  ) : undefined
                }
              >
                <Textarea
                  {...register("description")}
                  placeholder={t("addMeal.mealDescPlaceholder")}
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
                  {t("addMeal.mealImage")}
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
                  {t("addMeal.mealCategory")}
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
                            placeholder={t("addMeal.chooseCategory")}
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
                  {t("addMeal.inStock")}
                </Field.Label>
                <InputGroup
                  startElement={<MdOutlineProductionQuantityLimits />}
                >
                  <Input
                    {...register("stock", { valueAsNumber: true })}
                    type="number"
                    placeholder={t("addMeal.stockPlaceholder")}
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
                  {t("addMeal.prepTime")}
                </Field.Label>
                <InputGroup startElement={<IoTimeOutline />}>
                  <Input
                    {...register("preparation_time", { valueAsNumber: true })}
                    type="number"
                    placeholder={t("addMeal.prepTimePlaceholder")}
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

      <Dialog.Root
        open={warningOpen}
        onOpenChange={(e) => setWarningOpen(e.open)}
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="md"
              borderRadius="16px"
              bg={
                colorMode === "light"
                  ? colors.light.bgThird
                  : colors.dark.bgThird
              }
              borderWidth="2px"
              borderColor="red.500"
            >
              <Dialog.Header pb={2}>
                <Flex align="center" gap={3}>
                  <Box
                    p={2}
                    borderRadius="full"
                    bg="red.100"
                    color="red.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IoWarningOutline size={28} />
                  </Box>
                  <Dialog.Title fontSize="xl" fontWeight="bold" color="red.600">
                    {t("addMeal.imageNotPermitted")}
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              <Dialog.Body py={4}>
                <Text
                  fontSize="md"
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  lineHeight="1.6"
                >
                  {warningText}
                </Text>
              </Dialog.Body>

              <Dialog.Footer pt={2}>
                <Button
                  onClick={() => setWarningOpen(false)}
                  colorPalette="red"
                  width="full"
                  size="lg"
                  borderRadius="12px"
                >
                  Got it
                </Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default AddMealModal;
