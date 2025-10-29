import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  Field,
  Span,
  InputGroup,
  TagEndElement,
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
import { Link } from "react-router-dom";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { registerSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const CustomerRegister = () => {
  const { colorMode } = useColorMode();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const onSubmit = (data) => console.log(data);

  return (
    <Flex flex={1} p={8} align="center" justifyContent="center">
      <Box w="full" maxW="md" as="form" onSubmit={handleSubmit(onSubmit)}>
        <Flex direction={"column"} gap={4} align="stretch" justify={"center"}>
          {/* First & Last Name */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1} required>
              <Field.Label>
                First Name <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input
                  placeholder="Enter your first name"
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

            <Field.Root flex={1} required>
              <Field.Label>
                Last Name <Field.RequiredIndicator></Field.RequiredIndicator>
              </Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input
                  placeholder="Enter your last name"
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
          <Field.Root required>
            <Field.Label>
              Email <Field.RequiredIndicator></Field.RequiredIndicator>
            </Field.Label>
            <InputGroup startElement={<FaEnvelope />}>
              <Input
                placeholder="Enter your email"
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
          <Field.Root required>
            <Field.Label>
              Phone <Field.RequiredIndicator></Field.RequiredIndicator>
            </Field.Label>
            <InputGroup startElement={<FaPhone />}>
              <Input
                placeholder="Enter your phone number"
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

          {/* Address */}
          <Field.Root required>
            <Field.Label>
              Address <Field.RequiredIndicator></Field.RequiredIndicator>
            </Field.Label>
            <InputGroup startElement={<FaMapMarkerAlt />}>
              <Input
                placeholder="Enter your address"
                name="address"
                {...register("address")}
                value={user.address}
                onChange={(e) => {
                  handleChange(e);
                  clearErrors("address");
                }}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </InputGroup>
            {errors?.address && (
              <Field.HelperText color={"crimson"}>
                {errors?.address?.message}
              </Field.HelperText>
            )}
          </Field.Root>

          {/* Password & Confirm Password */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1} required>
              <Field.Label>
                Password <Field.RequiredIndicator></Field.RequiredIndicator>
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
                  placeholder="Enter your password"
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

            <Field.Root flex={1} required>
              <Field.Label>
                Confirm Password{" "}
                <Field.RequiredIndicator></Field.RequiredIndicator>
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
                  placeholder="Confirm password"
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
              {errors?.confirmPassword&&(
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
          >
            Create Customer Account
          </Button>

          <Text textAlign="center" fontSize="sm">
            Already a user?{" "}
            <Link to="/login">
              <Text
                as="span"
                color={colors.light.mainFixed}
                fontWeight="semibold"
                _hover={{ textDecoration: "underline" }}
              >
                Login
              </Text>
            </Link>
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CustomerRegister;
