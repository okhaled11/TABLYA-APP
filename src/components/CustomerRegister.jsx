import {
  Button,
  Flex,
  Text,
  Heading,
  Input,
  Stack,
  Image,
  Box,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
// import colors from "../theme/color";src/components/CustomerRegister.jsx


const CustomerRegister = () => {
//   const { colorMode } = useColorMode();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isName, setIsName] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const bg2 = useColorMode("gray.100", "gray.700");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name && !user.email && !user.password && !user.confirmPassword) {
      setIsName(true);
      setIsEmail(true);
      setIsPassword(true);
      setIsConfirmPassword(true);
      return;
    }
    if (!user.name) {
      setIsName(true);
      return;
    }
    setIsName(false);

    if (!user.email) {
      setIsEmail(true);
      return;
    }
    setIsEmail(false);
    if (!user.password) {
      setIsPassword(true);
      return;
    }
    setIsPassword(false);
    if (!user.confirmPassword) {
      setIsConfirmPassword(true);
      return;
    }
    if (user.password !== user.confirmPassword) {
      setIsConfirmPassword(true);
      return;
    }
    setIsConfirmPassword(false);
  };

  return (
    <Flex flex={1} p={8} align="center" justify="center">
      <Box w="full" maxW="md" as={"form"} onSubmit={handleSubmit}>
        <Stack spacing={6}>
          

          {/* --- Name --- */}
          <Box>
            <Text mb={2} fontWeight="medium">
              Full Name
            </Text>
            <Input
              type="text"
              focusBorderColor="blue.400"
              bg={bg2}
              borderColor={isName ? "crimson" : "gray.300"}
              name="name"
              value={user.name}
              onChange={handleChange}
            />
            {isName && (
              <Text fontSize="sm" color="red.500" mt={1}>
                Name is required.
              </Text>
            )}
          </Box>

          {/* --- Email --- */}
          <Box>
            <Text mb={2} fontWeight="medium">
              Email address
            </Text>
            <Input
              type="email"
              focusBorderColor="blue.400"
              bg={bg2}
              borderColor={isEmail ? "crimson" : "gray.300"}
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            {isEmail && (
              <Text fontSize="sm" color="red.500" mt={1}>
                Email is required.
              </Text>
            )}
          </Box>

          {/* --- Password --- */}
          <Box position="relative">
            <Text mb={2} fontWeight="semibold">
              Password
            </Text>
            <Input
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              bg={bg2}
              borderColor={isPassword ? "red.400" : "gray.300"}
              focusBorderColor={isPassword ? "red.400" : "blue.400"}
              name="password"
              value={user.password}
              onChange={handleChange}
              pr="3rem"
              h="50px"
              borderRadius="lg"
              fontSize="md"
              _hover={{ borderColor: "blue.300", boxShadow: "sm" }}
              _focus={{
                boxShadow: "0 0 0 1px #3182ce",
                borderColor: "blue.400",
                bg: "whiteAlpha.100",
              }}
              transition="all 0.2s ease"
            />

            <Box
              position="absolute"
              right="3"
              top="70%"
              transform="translateY(-50%)"
              cursor="pointer"
              color={showPassword ? "blue.500" : "gray.500"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </Box>

            {isPassword && (
              <Text fontSize="sm" color="red.500" mt={1}>
                Password is required.
              </Text>
            )}
          </Box>

          {/* --- Confirm Password --- */}
          <Box position="relative">
            <Text mb={2} fontWeight="semibold">
              Confirm Password
            </Text>
            <Input
              placeholder="Re-enter password"
              type={showConfirmPassword ? "text" : "password"}
              bg={bg2}
              borderColor={isConfirmPassword ? "red.400" : "gray.300"}
              focusBorderColor={isConfirmPassword ? "red.400" : "blue.400"}
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              pr="3rem"
              h="50px"
              borderRadius="lg"
              fontSize="md"
              _hover={{ borderColor: "blue.300", boxShadow: "sm" }}
              _focus={{
                boxShadow: "0 0 0 1px #3182ce",
                borderColor: "blue.400",
                bg: "whiteAlpha.100",
              }}
              transition="all 0.2s ease"
            />

            <Box
              position="absolute"
              right="3"
              top="70%"
              transform="translateY(-50%)"
              cursor="pointer"
              color={showConfirmPassword ? "blue.500" : "gray.500"}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </Box>

            {isConfirmPassword && (
              <Text fontSize="sm" color="red.500" mt={1}>
                Passwords must match.
              </Text>
            )}
          </Box>

          {/* --- Submit Button --- */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            _hover={{ bg: "blue.500" }}
          >
            Sign Up
          </Button>

          <Text textAlign="center" fontSize="sm">
            Already a user?{" "}
            <Link to="/login">
              <Text
                as="span"
                color="blue.400"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                Login
              </Text>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default CustomerRegister;
