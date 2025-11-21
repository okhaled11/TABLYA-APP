import {
  Box,
  Flex,
  Text,
  Field,
  Input,
  InputGroup,
  Button,
  Link,
  Icon,
  FileUpload,
} from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AddressDialog from "../shared/AddressDialog";
import { LuUpload } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchemaPersonaChef } from "../../validation";
import { useDispatch } from "react-redux";
import { getDataRegisterChef } from "../../app/features/PersonalRegisterChefSlice";
import { toaster } from "../ui/toaster";
import { uploadImageToImgBB } from "../../services/uploadImageToImageBB";
import { convertImageToWebP } from "../../services/imageToWebp";
import { useTranslation } from "react-i18next";
import { Link as LinkRoute } from "react-router-dom";
import { CloseButton } from "@chakra-ui/react";
import { MdInsertPhoto } from "react-icons/md";
import { useState } from "react";

export const PersonalRegisterChef = ({ nextStepHandler }) => {
  /* ---------------state----------------- */
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [hasAddedAddress, setHasAddedAddress] = useState(false);

  /* ---------------variable----------------- */
  const bgInput =
    colorMode === "light" ? colors.light.bgInput : colors.dark.bgInput;

  /* ---------------react hook form----------------- */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchemaPersonaChef) });

  const onSubmit = (data) => {
    // Check if address has been added
    if (!hasAddedAddress) {
      toaster.create({
        title: "Address Required",
        description: "Please add your address before continuing",
        type: "error",
        duration: 3500,
      });
      return;
    }

    console.log(data);
    const dataUpdated = { ...data };
    dispatch(getDataRegisterChef(dataUpdated));

    toaster.create({
      title: t("personalRegisterChef.successTitle"),
      description: t("personalRegisterChef.successDescription"),
      type: "success",
      duration: 3500,
    });
    nextStepHandler();
    console.log(data);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} spaceY={4}>
      {/* full name */}
      <Flex gap="4" direction={{ base: "column", md: "row" }}>
        {/* First Name */}
        <Field.Root invalid={!!errors.firstName}>
          <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
            {t("personalRegisterChef.firstName")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup
            {...(isRTL
              ? { endElement: <FaUser /> }
              : { startElement: <FaUser /> })}
          >
            <Input
              rounded="md"
              placeholder={t("personalRegisterChef.firstNamePlaceholder")}
              bg={bgInput}
              textAlign={isRTL ? "right" : "left"}
              {...register("firstName")}
            />
          </InputGroup>
          {errors.firstName && (
            <Field.ErrorText fontWeight="bold">
              {errors.firstName.message}
            </Field.ErrorText>
          )}
        </Field.Root>

        {/* Last Name */}
        <Field.Root invalid={!!errors.lastName}>
          <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
            {t("personalRegisterChef.lastName")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup
            {...(isRTL
              ? { endElement: <FaUser /> }
              : { startElement: <FaUser /> })}
          >
            <Input
              rounded="md"
              placeholder={t("personalRegisterChef.lastNamePlaceholder")}
              bg={bgInput}
              textAlign={isRTL ? "right" : "left"}
              {...register("lastName")}
            />
          </InputGroup>
          {errors.lastName && (
            <Field.ErrorText fontWeight="bold">
              {errors.lastName.message}
            </Field.ErrorText>
          )}
        </Field.Root>
      </Flex>

      {/* Email */}
      <Field.Root invalid={!!errors.email}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          {t("personalRegisterChef.email")}
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>
        <InputGroup
          {...(isRTL
            ? { endElement: <MdEmail /> }
            : { startElement: <MdEmail /> })}
        >
          <Input
            rounded="md"
            placeholder={t("personalRegisterChef.emailPlaceholder")}
            bg={bgInput}
            textAlign={isRTL ? "right" : "left"}
            {...register("email")}
          />
        </InputGroup>
        {errors.email && (
          <Field.ErrorText fontWeight="bold">
            {errors.email.message}
          </Field.ErrorText>
        )}
      </Field.Root>

      {/* Phone */}
      <Field.Root invalid={!!errors.phone}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          {t("personalRegisterChef.phone")}
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>
        <InputGroup
          {...(isRTL
            ? { endElement: <FaPhoneAlt /> }
            : { startElement: <FaPhoneAlt /> })}
        >
          <Input
            rounded="md"
            placeholder={t("personalRegisterChef.phonePlaceholder")}
            bg={bgInput}
            textAlign={isRTL ? "right" : "left"}
            {...register("phone")}
          />
        </InputGroup>
        {errors.phone && (
          <Field.ErrorText fontWeight="bold">
            {errors.phone.message}
          </Field.ErrorText>
        )}
      </Field.Root>

      {/*  there img */}
      {/* Upload selfie with your ID card front */}
      <Field.Root invalid={!!errors.id_card_front_url} spaceY={1}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          National ID (Front Side)
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>

        <FileUpload.Root
          gap="2"
          maxWidth="100%"
          bg={bgInput}
          rounded={"md"}
          accept="image/*"
          style={{
            display: "flex",
            justifyContent: isRTL ? "flex-end" : "flex-ebd",
          }}
          onFileAccept={async (details) => {
            const file = details.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
              toaster.create({
                title: "Invalid File Type",
                description:
                  "Please upload an image file only (JPG, PNG, GIF, etc.)",
                type: "error",
                duration: 3500,
              });
              return;
            }

            try {
              // Convert image to WebP format
              const webpFile = await convertImageToWebP(file, {
                quality: 0.85,
                maxWidth: 1920,
                maxHeight: 1920,
              });

              const imageUrl = await uploadImageToImgBB(webpFile);
              setValue("id_card_front_url", imageUrl, {
                shouldValidate: true,
              });
            } catch (error) {
              toaster.create({
                title: "Conversion Error",
                description:
                  "Failed to process image. Please try another file.",
                type: "error",
                duration: 3500,
              });
              console.error("Image conversion error:", error);
            }
          }}
        >
          <FileUpload.HiddenInput accept="image/*" />
          <InputGroup
            {...(isRTL
              ? {
                  startElement: (
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
                  ),
                  endElement: <MdInsertPhoto />,
                }
              : {
                  startElement: <MdInsertPhoto />,
                  endElement: (
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
                  ),
                })}
          >
            <Input asChild textAlign={isRTL ? "right" : "left"}>
              <FileUpload.Trigger>
                <FileUpload.FileText lineClamp={1} />
              </FileUpload.Trigger>
            </Input>
          </InputGroup>
        </FileUpload.Root>

        <Field.ErrorText fontWeight="bold">
          {errors.id_card_front_url?.message}
        </Field.ErrorText>
      </Field.Root>

      {/* Upload selfie with your ID card back */}
      <Field.Root invalid={!!errors.id_card_back_url} spaceY={1}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          National ID (Back Side)
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>

        <FileUpload.Root
          gap="2"
          maxWidth="100%"
          bg={bgInput}
          rounded={"md"}
          accept="image/*"
          style={{
            display: "flex",
            justifyContent: isRTL ? "flex-end" : "flex-ebd",
          }}
          onFileAccept={async (details) => {
            const file = details.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
              toaster.create({
                title: "Invalid File Type",
                description:
                  "Please upload an image file only (JPG, PNG, GIF, etc.)",
                type: "error",
                duration: 3500,
              });
              return;
            }

            try {
              // Convert image to WebP format
              const webpFile = await convertImageToWebP(file, {
                quality: 0.85,
                maxWidth: 1920,
                maxHeight: 1920,
              });

              const imageUrl = await uploadImageToImgBB(webpFile);
              setValue("id_card_back_url", imageUrl, {
                shouldValidate: true,
              });
            } catch (error) {
              toaster.create({
                title: "Conversion Error",
                description:
                  "Failed to process image. Please try another file.",
                type: "error",
                duration: 3500,
              });
              console.error("Image conversion error:", error);
            }
          }}
        >
          <FileUpload.HiddenInput accept="image/*" />
          <InputGroup
            {...(isRTL
              ? {
                  startElement: (
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
                  ),
                  endElement: <MdInsertPhoto />,
                }
              : {
                  startElement: <MdInsertPhoto />,
                  endElement: (
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
                  ),
                })}
          >
            <Input asChild textAlign={isRTL ? "right" : "left"}>
              <FileUpload.Trigger>
                <FileUpload.FileText lineClamp={1} />
              </FileUpload.Trigger>
            </Input>
          </InputGroup>
        </FileUpload.Root>

        <Field.ErrorText fontWeight="bold">
          {errors.id_card_back_url?.message}
        </Field.ErrorText>
      </Field.Root>

      {/* Upload Selfie with National ID */}
      <Field.Root invalid={!!errors.selfie_with_id_url} spaceY={2}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          Selfie with National ID
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>

        <FileUpload.Root
          gap="2"
          maxWidth="100%"
          bg={bgInput}
          rounded={"md"}
          accept="image/*"
          style={{
            display: "flex",
            justifyContent: isRTL ? "flex-end" : "flex-ebd",
          }}
          onFileAccept={async (details) => {
            const file = details.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
              toaster.create({
                title: "Invalid File Type",
                description:
                  "Please upload an image file only (JPG, PNG, GIF, etc.)",
                type: "error",
                duration: 3500,
              });
              return;
            }

            try {
              // Convert image to WebP format
              const webpFile = await convertImageToWebP(file, {
                quality: 0.85,
                maxWidth: 1920,
                maxHeight: 1920,
              });

              const imageUrl = await uploadImageToImgBB(webpFile);
              setValue("selfie_with_id_url", imageUrl, {
                shouldValidate: true,
              });
            } catch (error) {
              toaster.create({
                title: "Conversion Error",
                description:
                  "Failed to process image. Please try another file.",
                type: "error",
                duration: 3500,
              });
              console.error("Image conversion error:", error);
            }
          }}
        >
          <FileUpload.HiddenInput accept="image/*" />
          <InputGroup
            {...(isRTL
              ? {
                  startElement: (
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
                  ),
                  endElement: <MdInsertPhoto />,
                }
              : {
                  startElement: <MdInsertPhoto />,
                  endElement: (
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
                  ),
                })}
          >
            <Input asChild textAlign={isRTL ? "right" : "left"}>
              <FileUpload.Trigger>
                <FileUpload.FileText lineClamp={1} />
              </FileUpload.Trigger>
            </Input>
          </InputGroup>
        </FileUpload.Root>

        <Field.ErrorText fontWeight="bold">
          {errors.selfie_with_id_url?.message}
        </Field.ErrorText>
      </Field.Root>

      {/* Add Address Button */}
      <Button
        leftIcon={<FaMapMarkerAlt />}
        variant={hasAddedAddress ? "solid" : "outline"}
        borderColor="#FA2c23"
        bg={hasAddedAddress ? "#FA2c23" : "transparent"}
        color={hasAddedAddress ? "white" : "#FA2c23"}
        w="100%"
        rounded="md"
        onClick={() => setIsAddressDialogOpen(true)}
        _hover={{
          bg: "#FA2c2310",
        }}
      >
        {hasAddedAddress ? "✓ Address Added" : "Add Address *"}
      </Button>

      {/* Continue */}
      <Button bg="#FA2c23" type="submit" w="100%" rounded="md">
        {t("personalRegisterChef.continue")}
      </Button>

      {/* Login */}
      <Text textAlign="center" dir={isRTL ? "rtl" : "ltr"}>
        {t("personalRegisterChef.alreadyHaveAccount")}
        <Link
          as={LinkRoute}
          to="/login"
          fontWeight="bold"
          ms={1}
          _focus={{ outline: "none" }}
          color="#FA2c23"
        >
          {t("personalRegisterChef.login")}
        </Link>
      </Text>

      {/* Address Dialog */}
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressAdded={() => setHasAddedAddress(true)}
        userType="chef"
      />
    </Box>
  );
};
