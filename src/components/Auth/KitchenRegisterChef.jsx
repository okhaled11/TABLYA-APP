import { Box } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { Link } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { Field, Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbToolsKitchen2 } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import colors from "../../theme/color";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useColorMode } from "../../theme/color-mode";
import { useSelector, useDispatch } from "react-redux";
import { clearRegistrationAddress } from "../../app/features/Auth/registrationAddressSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchemaKitchenChef } from "../../validation";
import { toaster } from "../ui/toaster";
import { useRegisterChefMutation } from "../../app/features/Auth/registerChefSlice";
import { useNavigate } from "react-router-dom";
import { Link as LinkRoute } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function KitchenRegisterChef() {
  /* ---------------state----------------- */
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerChef, { data, isError, error, isSuccess, isLoading }] =
    useRegisterChefMutation();
  console.log(data, isError, isLoading, isSuccess);

  /* ----------------data in store------------- */
  const { dataRegisterChef } = useSelector(
    (state) => state.PersonalRegisterChef
  );
  /* ---------------variables----------------- */
  const bgInput =
    colorMode === "light" ? colors.light.bgInput : colors.dark.bgInput;

  /* ---------------react hook form----------------- */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(getRegisterSchemaKitchenChef(t)) });

  const onSubmit = (data) => {
    console.log(dataRegisterChef);
    const allDataRegisterChef = {
      role: "cooker",
      name: `${dataRegisterChef.firstName} ${dataRegisterChef.lastName}`,
      ...dataRegisterChef,
      ...data,
      specialty: data.specialty, // Keep original value or use key? Usually stored as english value or key. Assuming value for now.
    };
    console.log(allDataRegisterChef);
    registerChef(allDataRegisterChef);
    reset();
  };

  /* --------------effect---------------- */
  useEffect(() => {
    if (isSuccess && data) {
      setTimeout(
        () =>
          toaster.create({
            title: t("kitchenRegisterChef.successTitle"),
            description: t("kitchenRegisterChef.successDescription"),
            type: "success",
            duration: 3500,
          }),
        200
      );
      // Clear registration address after successful registration
      dispatch(clearRegistrationAddress());
      setTimeout(() => navigate("/login"), 500);
    }

    if (isError && error) {
      toaster.create({
        title: t("kitchenRegisterChef.errorTitle"),
        description:
          error?.message || t("kitchenRegisterChef.errorDescription"),
        type: "error",
        duration: 4000,
      });
    }
  }, [isError, error, data, isSuccess, navigate, t]);

  return (
    <>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} spaceY={8}>
        {/* Kitchen Name */}
        <Field.Root invalid={!!errors.KitchenName}>
          <Field.Label
            me={"auto"}
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
            mb={2}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("kitchenRegisterChef.kitchenName")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup startElement={<TbToolsKitchen2 />}>
            <Input
              rounded="md"
              placeholder={t("kitchenRegisterChef.kitchenNamePlaceholder")}
              bg={bgInput}
              border="1px solid"
              borderColor={colorMode === "light" ? "gray.200" : "transparent"}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              _placeholder={{ color: "gray.500" }}
              textAlign={isRTL ? "right" : "left"}
              ps="2rem"
              {...register("KitchenName")}
            />
          </InputGroup>
          <Field.ErrorText fontWeight="bold">
            {errors.KitchenName?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Working Hours */}
        <Box>
          <Field.Root>
            <Field.Label
              me={"auto"}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              fontWeight="medium"
              mb={2}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("kitchenRegisterChef.workingHours")}
              <Text as="span" color="#FA2c23">
                *
              </Text>
            </Field.Label>
          </Field.Root>

          <Flex gap="4" direction={{ base: "column", md: "row" }}>
            {/* Start Time */}
            <Field.Root invalid={!!errors.StartTime} flex={1}>
              <Field.Label
                me={"auto"}
                fontSize="sm"
                mb={2}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("kitchenRegisterChef.startTime")}
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<MdAccessTime />}>
                <Input
                  rounded="md"
                  type="time"
                  bg={bgInput}
                  border="1px solid"
                  borderColor={
                    colorMode === "light" ? "gray.200" : "transparent"
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  textAlign={isRTL ? "right" : "left"}
                  ps="2rem"
                  {...register("StartTime")}
                />
              </InputGroup>
              <Field.ErrorText fontWeight="bold">
                {errors.StartTime?.message}
              </Field.ErrorText>
            </Field.Root>

            {/* End Time */}
            <Field.Root invalid={!!errors.EndTime} flex={1}>
              <Field.Label
                me={"auto"}
                fontSize="sm"
                mb={2}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("kitchenRegisterChef.endTime")}
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<MdAccessTime />}>
                <Input
                  rounded="md"
                  type="time"
                  bg={bgInput}
                  border="1px solid"
                  borderColor={
                    colorMode === "light" ? "gray.200" : "transparent"
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  textAlign={isRTL ? "right" : "left"}
                  ps="2rem"
                  {...register("EndTime")}
                />
              </InputGroup>
              <Field.ErrorText fontWeight="bold">
                {errors.EndTime?.message}
              </Field.ErrorText>
            </Field.Root>
          </Flex>
        </Box>

        {/* specialty  */}
        <Field.Root invalid={!!errors.specialty}>
          <Field.Label
            me={"auto"}
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
            mb={2}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("kitchenRegisterChef.specialty")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <Box position="relative" w={"100%"}>
            <NativeSelectRoot>
              <NativeSelectField
                rounded="md"
                bg={bgInput}
                border="1px solid"
                borderColor={colorMode === "light" ? "gray.200" : "transparent"}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
                textAlign={isRTL ? "right" : "left"}
                pr={isRTL ? "1rem" : "1rem"}
                pl={isRTL ? "1rem" : "1rem"}
                h="45px"
                fontSize={{ base: "sm", md: "md" }}
                cursor="pointer"
                _hover={{
                  borderColor: colorMode === "light" ? "gray.300" : "gray.600",
                }}
                {...register("specialty")}
              >
                <option value="" selected>
                  {t("kitchenRegisterChef.chooseSpecialty")}
                </option>
                <option value="Traditional Egyptian">
                  {t("kitchenRegisterChef.specialties.egyptian")}
                </option>
                <option value="Homemade Grills">
                  {t("kitchenRegisterChef.specialties.grills")}
                </option>
                <option value="Seafood">
                  {t("kitchenRegisterChef.specialties.seafood")}
                </option>
                <option value="Desserts & Sweets">
                  {t("kitchenRegisterChef.specialties.desserts")}
                </option>
                <option value="Healthy & Diet Meals">
                  {t("kitchenRegisterChef.specialties.healthy")}
                </option>
                <option value="Vegetarian Dishes">
                  {t("kitchenRegisterChef.specialties.vegetarian")}
                </option>
              </NativeSelectField>
            </NativeSelectRoot>
            <Box
              position="absolute"
              top="50%"
              {...(isRTL ? { left: "15rem" } : { right: "1rem" })}
              transform="translateY(-50%)"
              pointerEvents="none"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
            >
              <IoChevronDown size={20} />
            </Box>
          </Box>
          <Field.ErrorText fontWeight="bold">
            {errors.specialty?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Password */}
        <Field.Root flex={1} invalid={!!errors.password}>
          <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
            {t("kitchenRegisterChef.password")}{" "}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup
            startElement={<FaLock />}
            endElement={
              showPassword ? (
                <AiOutlineEyeInvisible
                  size={18}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <AiOutlineEye
                  size={18}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )
            }
          >
            <Input
              placeholder={t("kitchenRegisterChef.passwordPlaceholder")}
              type={showPassword ? "text" : "password"}
              bg={bgInput}
              borderRadius="10px"
              pe="3rem"
              ps="2.5rem"
              textAlign={isRTL ? "right" : "left"}
              {...register("password")}
            />
          </InputGroup>
          <Field.ErrorText fontWeight="bold">
            {errors.password?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Confirm Password */}
        <Field.Root flex={1} invalid={!!errors.confirmPassword}>
          <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
            {t("kitchenRegisterChef.confirmPassword")}
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup
            startElement={<FaLock />}
            endElement={
              showConfirmPassword ? (
                <AiOutlineEyeInvisible
                  size={18}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              ) : (
                <AiOutlineEye
                  size={18}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              )
            }
          >
            <Input
              placeholder={t("kitchenRegisterChef.confirmPasswordPlaceholder")}
              type={showConfirmPassword ? "text" : "password"}
              bg={bgInput}
              borderRadius="10px"
              pe="3rem"
              ps="2rem"
              textAlign={isRTL ? "right" : "left"}
              {...register("confirmPassword")}
            />
          </InputGroup>
          <Field.ErrorText fontWeight="bold">
            {errors.confirmPassword?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Submit Button */}
        <Button
          bg="#FA2c23"
          type="submit"
          w="100%"
          rounded="md"
          color="white"
          fontWeight="bold"
          loading={isLoading}
          py={6}
          mt={6}
          _hover={{ bg: "#d91f17" }}
        >
          {t("kitchenRegisterChef.createChefAccount")}
        </Button>

        {/* Login link */}
        <Text
          textAlign="center"
          color={
            colorMode === "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          {t("kitchenRegisterChef.alreadyHaveAccount")}{" "}
          <Link
            as={LinkRoute}
            to={"/login"}
            fontWeight="bold"
            _focus={{ outline: "none" }}
            color="#FA2c23"
          >
            {t("kitchenRegisterChef.login")}
          </Link>
        </Text>
      </Box>
    </>
  );
}
