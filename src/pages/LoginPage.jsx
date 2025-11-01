import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  Field,
  InputGroup,
  Image,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerPhoto from "../assets/Images_Auth/register.png";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { LoginSchema } from "../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "../layout/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../app/features/Auth/loginSLice";
import CookieService from "../services/cookies";
import Footer from "../shared/Footer";

const LoginPage = () => {
  const { colorMode } = useColorMode();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isPending } = useSelector((state) => state.auth);

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
  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user?.user_metadata?.role;

      toaster.create({
        title: "Login Successful",
        description: `Welcome back, ${
          result.payload?.user?.user_metadata?.name || "User"
        }!`,
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      const date = new Date();
      date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);
      CookieService.set("access_token", result.payload.session.access_token, {
        path: "/",
        expires: date,
      });
      // redirect depends on role
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "chef") {
          navigate("/chef");
        } else if (role === "customer") {
          navigate("/home");
        } else {
          navigate("/");
        }
      }, 500);
    } else if (loginUser.rejected.match(result)) {
      // Check if it's a pending approval case
      if (result.payload?.type === "pending") {
        // Navigate to pending approval page instead of showing toast
        navigate("/pending-approval");
      } else {
        toaster.create({
          title: "Login Failed",
          description:
            result.payload?.message ||
            result.payload ||
            "Invalid email or password",
          type: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
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
                  loading={loading}
                  color={"#FFF7F0"}
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
      <Footer />
    </>
  );
};

export default LoginPage;
