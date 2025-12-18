import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  Field,
  InputGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaUserAlt,
} from "react-icons/fa";
import AddressDialog from "../shared/AddressDialog";
import { Link, useNavigate } from "react-router-dom";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { getRegisterSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer } from "../../app/features/Auth/registerCustomerSlice";
import { clearRegistrationAddress } from "../../app/features/Auth/registrationAddressSlice";
import { toaster } from "../ui/toaster";
import { useTranslation } from "react-i18next";
import { resendConfirmation } from "../../services/authService";

const CustomerRegister = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { colorMode } = useColorMode();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [hasAddedAddress, setHasAddedAddress] = useState(false);
  const { loading, needsEmailConfirmation, confirmationMessage } = useSelector(
    (state) => state.register
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  // Schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(getRegisterSchema(t)),
  });
  // handle submit
  const onSubmit = async (data) => {
    // Check if address has been added
    if (!hasAddedAddress) {
      toaster.create({
        title: t("customerRegister.errorTitle"),
        description: t("customerRegister.addAddressError"),
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const result = await dispatch(
      registerCustomer({
        ...data,
        role: "customer",
        name: `${data.firstName} ${data.lastName}`,
      })
    );
    if (registerCustomer.fulfilled.match(result)) {
      // Check if email confirmation is needed
      if (result.payload.needsEmailConfirmation) {
        toaster.create({
          title: t("customerRegister.successTitle"),
          description:
            result.payload.message ||
            t("customerRegister.checkEmailDescription"),
          status: "info",
          duration: 8000,
          isClosable: true,
        });
        // Don't redirect, show confirmation message instead
      } else {
        toaster.create({
          title: t("customerRegister.successTitle"),
          description: t("customerRegister.successDescription"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Clear registration address after successful registration
        dispatch(clearRegistrationAddress());
        // redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } else if (registerCustomer.rejected.match(result)) {
      toaster.create({
        title: t("customerRegister.errorTitle"),
        description: result.payload || t("customerRegister.errorDescription"),
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Handle resend confirmation email
  const handleResendConfirmation = async () => {
    setResendLoading(true);
    try {
      await resendConfirmation(user.email);
      toaster.create({
        title: t("customerRegister.resendSuccess"),
        description: t("customerRegister.resendSuccessDesc"),
        status: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: t("customerRegister.resendError"),
        description: error.message || t("customerRegister.errorDescription"),
        status: "error",
        duration: 5000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Show email confirmation message if needed
  if (needsEmailConfirmation) {
    return (
      <Flex flex={1} p={8} align="center" justifyContent="center">
        <Box
          w="full"
          maxW="md"
          p={8}
          bg={
            colorMode === "light"
              ? colors.light.bgSecondary
              : colors.dark.bgSecondary
          }
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
        >
          <Flex direction="column" gap={4} align="center">
            <Box
              p={4}
              borderRadius="full"
              bg={colorMode === "light" ? colors.light.main : colors.dark.main}
              color="white"
            >
              <FaEnvelope size={24} />
            </Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {t("customerRegister.checkEmailTitle")}
            </Text>
            <Text
              fontSize="md"
              color={
                colorMode === "light"
                  ? colors.light.textSecondary
                  : colors.dark.textSecondary
              }
              textAlign="center"
            >
              {confirmationMessage ||
                t("customerRegister.checkEmailDescription")}
            </Text>
            <Flex gap={3} mt={4} direction={{ base: "column", sm: "row" }}>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                flex={1}
              >
                {t("customerRegister.backToLogin")}
              </Button>
              <Button
                onClick={handleResendConfirmation}
                isLoading={resendLoading}
                loadingText={t("customerRegister.resendEmail") + "..."}
                colorScheme="blue"
                flex={1}
                bg={colors.light.error}
              >
                {t("customerRegister.resendEmail")}
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex flex={1} p={8} align="center" justifyContent="center">
      <Box w="full" maxW="md" as="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} gap={4} align="stretch" justify={"center"}>
          {/* First & Last Name */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1} invalid={!!errors.firstName}>
              <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
                {t("customerRegister.firstName")}{" "}
                <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input
                  placeholder={t("customerRegister.firstNamePlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  name="firstName"
                  {...register("firstName")}
                  type="text"
                  value={user.firstName}
                  ps="2.5rem"
                  onChange={(e) => {
                    handleChange(e);
                    clearErrors("firstName");
                  }}
                  bg={
                    colorMode == "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors.firstName && (
                <Field.HelperText color={"crimson"}>
                  {errors?.firstName?.message}
                </Field.HelperText>
              )}
            </Field.Root>

            <Field.Root flex={1} invalid={!!errors.lastName}>
              <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
                {t("customerRegister.lastName")}{" "}
                <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input
                  placeholder={t("customerRegister.lastNamePlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  name="lastName"
                  {...register("lastName")}
                  value={user.lastName}
                  ps="2.5rem"
                  onChange={(e) => {
                    handleChange(e);
                    clearErrors("lastName");
                  }}
                  bg={
                    colorMode == "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                />
              </InputGroup>
              {errors?.lastName && (
                <Field.HelperText color={"crimson"}>
                  {errors?.lastName?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </Flex>

          {/* Email */}
          <Field.Root invalid={!!errors.email}>
            <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
              {t("customerRegister.email")}{" "}
              <Field.RequiredIndicator></Field.RequiredIndicator>
            </Field.Label>
            <InputGroup startElement={<FaEnvelope />}>
              <Input
                placeholder={t("customerRegister.emailPlaceholder")}
                textAlign={isRTL ? "right" : "left"}
                type="email"
                name="email"
                {...register("email")}
                value={user.email}
                ps="2.5rem"
                onChange={(e) => {
                  handleChange(e);
                  clearErrors("email");
                }}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </InputGroup>
            {errors?.email && (
              <Field.HelperText color={"crimson"}>
                {errors?.email?.message}
              </Field.HelperText>
            )}
          </Field.Root>

          {/* Phone */}
          <Field.Root invalid={!!errors.phone}>
            <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
              {t("customerRegister.phone")}{" "}
              <Field.RequiredIndicator></Field.RequiredIndicator>
            </Field.Label>
            <InputGroup startElement={<FaPhone />}>
              <Input
                placeholder={t("customerRegister.phonePlaceholder")}
                textAlign={isRTL ? "right" : "left"}
                name="phone"
                {...register("phone")}
                value={user.phone}
                ps="2.5rem"
                onChange={(e) => {
                  handleChange(e);
                  clearErrors("phone");
                }}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </InputGroup>
            {errors?.phone && (
              <Field.HelperText color={"crimson"}>
                {errors?.phone?.message}
              </Field.HelperText>
            )}
          </Field.Root>

          {/* Password & Confirm Password */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1} invalid={!!errors.password}>
              <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
                {t("customerRegister.password")}{" "}
                <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup
                startElement={<FaLock />}
                endElement={
                  showPassword ? (
                    <AiOutlineEye
                      size={18}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      size={18}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )
                }
              >
                <Input
                  placeholder={t("customerRegister.passwordPlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  {...register("password")}
                  value={user.password}
                  onChange={(e) => {
                    handleChange(e);
                    clearErrors("password");
                  }}
                  autoComplete="password"
                  bg={
                    colorMode == "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                  pe="3rem"
                  ps="2.5rem"
                />
              </InputGroup>
              {errors?.password && (
                <Field.HelperText color={"crimson"}>
                  {errors?.password?.message}
                </Field.HelperText>
              )}
            </Field.Root>
            <Field.Root flex={1} invalid={!!errors.confirmPassword}>
              <Field.Label me={"auto"} dir={isRTL ? "rtl" : "ltr"}>
                {t("customerRegister.confirmPassword")}{" "}
                <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup
                startElement={<FaLock />}
                endElement={
                  showConfirmPassword ? (
                    <AiOutlineEye
                      size={18}
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      size={18}
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                    />
                  )
                }
              >
                <Input
                  placeholder={t("customerRegister.confirmPasswordPlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  {...register("confirmPassword")}
                  value={user.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    clearErrors("confirmPassword");
                  }}
                  autoComplete="confirm-password"
                  bg={
                    colorMode == "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  borderRadius="10px"
                  pe="3rem"
                  ps="2.5rem"
                />
              </InputGroup>
              {errors?.confirmPassword && (
                <Field.HelperText color={"crimson"}>
                  {errors?.confirmPassword?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </Flex>

          {/* Add Address Button */}
          <Button
            leftIcon={<FaMapMarkerAlt />}
            variant={hasAddedAddress ? "solid" : "outline"}
            borderColor={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            bg={
              hasAddedAddress
                ? colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
                : "transparent"
            }
            color={
              hasAddedAddress
                ? "white"
                : colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            borderRadius="12px"
            w="full"
            onClick={() => setIsAddressDialogOpen(true)}
            _hover={{
              bg:
                colorMode === "light"
                  ? colors.light.mainFixed10a
                  : colors.dark.mainFixed10a,
            }}
          >
            {hasAddedAddress
              ? t("customerRegister.addressAdded")
              : t("customerRegister.addAddress")}
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            bg={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            size="lg"
            borderRadius={12}
            w="full"
            mt={10}
            onClick={handleSubmit}
            loading={loading}
            color={"#FFF7F0"}
          >
            {t("customerRegister.createAccount")}
          </Button>

          <Text textAlign="center" fontSize="sm" dir={isRTL ? "rtl" : "ltr"}>
            {t("customerRegister.alreadyUser")}{" "}
            <Link to="/login">
              <Text
                as="span"
                color={colors.light.mainFixed}
                fontWeight="semibold"
                _hover={{ textDecoration: "underline" }}
              >
                {t("customerRegister.login")}
              </Text>
            </Link>
          </Text>
        </Flex>
      </Box>

      {/* Address Dialog */}
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onAddressAdded={() => setHasAddedAddress(true)}
        userType="customer"
      />
    </Flex>
  );
};

export default CustomerRegister;
