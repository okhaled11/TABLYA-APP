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
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchemaPersonaChef } from "../../validation";
import { useDispatch } from "react-redux";
import { getDataRegisterChef } from "../../app/features/PersonalRegisterChefSlice";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import { uploadImageToImgBB } from "../../services/uploadImageToImageBB";
import { useTranslation } from "react-i18next";
import { Link as LinkRoute } from "react-router-dom";

export const PersonalRegisterChef = ({ nextStepHandler }) => {
  /* ---------------state----------------- */
  const { colorMode } = useColorMode();
  const [linkImg, setLinkImg] = useState("");
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

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
    const dataUpdated = { ...data, idVerification: linkImg };
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
          <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"} >
            {t("personalRegisterChef.firstName")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup {...(isRTL ? { endElement: <FaUser /> } : { startElement: <FaUser /> })}>
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
          <InputGroup {...(isRTL ? { endElement: <FaUser /> } : { startElement: <FaUser /> })}>
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
        <InputGroup {...(isRTL ? { endElement: <MdEmail /> } : { startElement: <MdEmail /> })}>
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
        <InputGroup {...(isRTL ? { endElement: <FaPhoneAlt /> } : { startElement: <FaPhoneAlt /> })}>
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

      {/* ID Verification */}
      <Field.Root invalid={!!errors.idVerification}>
        <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
          {t("personalRegisterChef.idVerification")}
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>

        <FileUpload.Root
          alignItems="stretch"
          maxFiles={1}
          onFileAccept={async (details) => {
            const file = details.files?.[0];
            if (!file) return;
            const imageUrl = await uploadImageToImgBB(file);
            setLinkImg(imageUrl);
            setValue("idVerification", imageUrl, { shouldValidate: true });
          }}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone
            rounded="xl"
            p={6}
            bg={bgInput}
            backgroundImage={linkImg ? `url(${linkImg})` : "none"}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
          >
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>{t("personalRegisterChef.uploadId")}</Box>
              <Box color="fg.muted">{t("personalRegisterChef.chooseFile")}</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
        </FileUpload.Root>
        {errors.idVerification && (
          <Field.ErrorText fontWeight="bold">
            {errors.idVerification.message}
          </Field.ErrorText>
        )}
      </Field.Root>

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
    </Box>
  );
};
