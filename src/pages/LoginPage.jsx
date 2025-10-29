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
  Image,
  VStack,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerPhoto from "../assets/Images_Auth/register.png";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaUserAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { LoginSchema } from "../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const LoginPage = () => {
  const { colorMode } = useColorMode();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });
  const onSubmit = (data) => console.log(data);

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={colorMode == "light" ? colors.light.bgMain : colors.dark.bgMain}
      px={4}
      py={10}
    >
      <Flex
        w={{ base: "100%", md: "70%" }}
        h={600}
        justifyContent={"center"}
        borderRadius="2xl"
        bg={colorMode == "light" ? colors.light.bgThird : colors.dark.bgFixed}
      >
        <Flex
          flex={1}
          p={8}
          align="center"
          justifyContent="center"
          direction={"column"}
        >
          <VStack mb={5}>
            <Heading
              fontSize="3xl"
              fontWeight={"bold"}
              textAlign="center"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              Login
            </Heading>
            <Text fontSize={"sm"} color={"#968782"}>
              Continue your homemade experience
            </Text>
          </VStack>
          <Box w="full" maxW="md" as="form" onSubmit={handleSubmit(onSubmit)}>
            <Flex
              direction={"column"}
              gap={4}
              align="stretch"
              justify={"center"}
            >
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
              {/* {/* Password} */}
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
                {errors.password && (
                  <Field.HelperText color={"crimson"}>
                    {errors?.password?.message}
                  </Field.HelperText>
                )}
              </Field.Root>

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
                Login
              </Button>

              <Text textAlign="center" fontSize="sm">
                Don’t have an account?{" "}
                <Link to="/register">
                  <Text
                    as="span"
                    color={colors.light.mainFixed}
                    fontWeight="semibold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Create Account
                  </Text>
                </Link>
              </Text>
            </Flex>
          </Box>
        </Flex>

        {/* image */}
        <Flex flex={1} display={{ base: "none", md: "block" }}>
          <Image
            alt="Signup Image"
            objectFit="cover"
            w="100%"
            h="100%"
            src={registerPhoto}
            rounded={"md"}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
