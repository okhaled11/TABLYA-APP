import {
  Flex,
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Icon,
  Field,
  Span,
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

  // const [isPassword, setIsPassword] = useState(false);
  // const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Keep your existing validation logic
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.phone ||
      !user.address ||
      !user.password ||
      !user.confirmPassword ||
      user.password !== user.confirmPassword
    ) {
      // setIsPassword(!user.password);
      // setIsConfirmPassword(user.password !== user.confirmPassword);
      // return;
    }
    console.log("Form submitted", user);
  };

  return (
    <Flex flex={1} p={8} align="center" justifyContent="center">
      <Box w="full" maxW="md" as="form" onSubmit={handleSubmit}>
        <Flex direction={"column"} gap={4} align="stretch" justify={"center"}>
          {/* First & Last Name */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1}>
              <Field.Label>
                First Name <Span color={"red.500"}>*</Span>
              </Field.Label>
              <Input
                placeholder="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>
                Last Name <Span color={"red.500"}>*</Span>
              </Field.Label>
              <Input
                placeholder="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
              />
            </Field.Root>
          </Flex>

          {/* Email */}
          <Field.Root>
            <Field.Label>
              Email <Span color={"red.500"}>*</Span>
            </Field.Label>
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              bg={
                colorMode == "light"
                  ? colors.light.bgInput
                  : colors.dark.bgInput
              }
              borderRadius="10px"
            />
          </Field.Root>

          {/* Phone */}
          <Field.Root>
            <Field.Label>
              Phone <Span color={"red.500"}>*</Span>
            </Field.Label>
            <Input
              placeholder="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              bg={
                colorMode == "light"
                  ? colors.light.bgInput
                  : colors.dark.bgInput
              }
              borderRadius="10px"
            />
          </Field.Root>

          {/* Address */}
          <Field.Root>
            <Field.Label>
              Location <Span color={"red.500"}>*</Span>
            </Field.Label>
            <Input
              placeholder="Address"
              name="address"
              value={user.address}
              onChange={handleChange}
              bg={
                colorMode == "light"
                  ? colors.light.bgInput
                  : colors.dark.bgInput
              }
              borderRadius="10px"
            />
          </Field.Root>

          {/* Password & Confirm Password */}
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <Field.Root flex={1}>
              <Field.Label>
                Password <Span color={"red.500"}>*</Span>
              </Field.Label>
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
                pr="3rem"
              />
              <Box
                position="absolute"
                right="3"
                top="70%"
                transform="translateY(-50%)"
                cursor="pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </Box>
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>
                Confirm Password <Span color={"red.500"}>*</Span>
              </Field.Label>
              <Input
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                bg={
                  colorMode == "light"
                    ? colors.light.bgInput
                    : colors.dark.bgInput
                }
                borderRadius="10px"
                pr="3rem"
              />
              <Box
                position="absolute"
                right="3"
                top="70%"
                transform="translateY(-50%)"
                cursor="pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </Box>
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
