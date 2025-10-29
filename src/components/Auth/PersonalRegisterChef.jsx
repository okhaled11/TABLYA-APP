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

export const PersonalRegisterChef = ({ nextStepHandler }) => {
  /* ---------------state----------------- */
  const { colorMode } = useColorMode();
  const [linkImg, setLinkImg] = useState("");
  const dispatch = useDispatch();

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
      title: "👨‍🍳 Personal Info Saved!",
      description:
        "Your data was saved successfully. Continue to the next step.",
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
          <Field.Label>
            First Name
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup startElement={<FaUser />}>
            <Input
              rounded="md"
              placeholder="Enter your first name"
              bg={bgInput}
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
          <Field.Label>
            Last Name
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup startElement={<FaUser />}>
            <Input
              rounded="md"
              placeholder="Enter your last name"
              bg={bgInput}
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
        <Field.Label>
          Email
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>
        <InputGroup startElement={<MdEmail />}>
          <Input
            rounded="md"
            placeholder="Enter your email"
            bg={bgInput}
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
        <Field.Label>
          Phone
          <Text as="span" color="#FA2c23">
            *
          </Text>
        </Field.Label>
        <InputGroup startElement={<FaPhoneAlt />}>
          <Input
            rounded="md"
            placeholder="Enter your phone number"
            bg={bgInput}
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
        <Field.Label>
          ID Verification
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

            const formData = new FormData();
            formData.append("image", file);

            try {
              const res = await fetch(
                `https://api.imgbb.com/1/upload?key=d183504d942d2c443013abb243f6852a`,
                {
                  method: "POST",
                  body: formData,
                }
              );

              const data = await res.json();

              if (data.success) {
                const imageUrl = data.data.url;
                setLinkImg(imageUrl);
                setValue("idVerification", imageUrl, { shouldValidate: true });

                toaster.create({
                  title: "👨‍🍳 ID Uploaded!",
                  description: "Your ID image has been uploaded successfully.",
                  type: "success",
                  duration: 3000,
                  position: "top-center",
                });
              } else {
                throw new Error("Upload failed");
              }
            } catch (error) {
              console.error("Error uploading image:", error);
              toaster.create({
                title: "Upload Failed",
                description:
                  "There was an issue uploading your ID. Please try again.",
                type: "error",
                duration: 3000,
                position: "top-center",
              });
            }
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
              <Box>Upload your government ID</Box>
              <Box color="fg.muted">Choose File</Box>
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
        Continue
      </Button>

      {/* Login */}
      <Text textAlign="center">
        Already have an account?
        <Link
          fontWeight="bold"
          ms={1}
          _focus={{ outline: "none" }}
          color="#FA2c23"
          href="#"
        >
          Login
        </Link>
      </Text>
    </Box>
  );
};
