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
import { Link, useNavigate } from "react-router-dom";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { registerSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer } from "../../app/features/Auth/registerCustomerSlice";
import { toaster } from "../ui/toaster";
import { useTranslation } from "react-i18next";

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
  const { loading } = useSelector((state) => state.register);
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
    resolver: yupResolver(registerSchema),
  });
  // handle submit
  const onSubmit = async (data) => {
    const result = await dispatch(
      registerCustomer({
        ...data,
        role: "customer",
        name: `${data.firstName} ${data.lastName}`,
      })
    );
    if (registerCustomer.fulfilled.match(result)) {
      toaster.create({
        title: t("customerRegister.successTitle"),
        description: t("customerRegister.successDescription"),
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      // redirect depends on role
      setTimeout(() => {
        navigate("/login");
      }, 500);
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
              <InputGroup
                {...(isRTL
                  ? { endElement: <FaUser /> }
                  : { startElement: <FaUser /> })}
              >
                <Input
                  placeholder={t("customerRegister.firstNamePlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  name="firstName"
                  {...register("firstName")}
                  type="text"
                  value={user.firstName}
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
              <InputGroup
                {...(isRTL
                  ? { endElement: <FaUser /> }
                  : { startElement: <FaUser /> })}
              >
                <Input
                  placeholder={t("customerRegister.lastNamePlaceholder")}
                  textAlign={isRTL ? "right" : "left"}
                  name="lastName"
                  {...register("lastName")}
                  value={user.lastName}
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
            <InputGroup
              {...(isRTL
                ? { endElement: <FaEnvelope /> }
                : { startElement: <FaEnvelope /> })}
            >
              <Input
                placeholder={t("customerRegister.emailPlaceholder")}
                textAlign={isRTL ? "right" : "left"}
                type="email"
                name="email"
                {...register("email")}
                value={user.email}
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
            <InputGroup
              {...(isRTL
                ? { endElement: <FaPhone /> }
                : { startElement: <FaPhone /> })}
            >
              <Input
                placeholder={t("customerRegister.phonePlaceholder")}
                textAlign={isRTL ? "right" : "left"}
                name="phone"
                {...register("phone")}
                value={user.phone}
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
                {...(isRTL
                  ? {
                      startElement: showPassword ? (
                        <AiOutlineEye
                          size={18}
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={18}
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      ),
                      endElement: <FaLock />,
                    }
                  : {
                      startElement: <FaLock />,
                      endElement: showPassword ? (
                        <AiOutlineEye
                          size={18}
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={18}
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      ),
                    })}
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
                  pr="3rem"
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
                {...(isRTL
                  ? {
                      startElement: showConfirmPassword ? (
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
                      ),
                      endElement: <FaLock />,
                    }
                  : {
                      startElement: <FaLock />,
                      endElement: showConfirmPassword ? (
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
                      ),
                    })}
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
                  pr="3rem"
                />
              </InputGroup>
              {errors?.confirmPassword && (
                <Field.HelperText color={"crimson"}>
                  {errors?.confirmPassword?.message}
                </Field.HelperText>
              )}
            </Field.Root>
          </Flex>

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
    </Flex>
  );
};

export default CustomerRegister;
