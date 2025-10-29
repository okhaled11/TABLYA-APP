import { Box } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { Link } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { Field, Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { TbToolsKitchen2 } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";
import colors from "../../theme/color";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useColorMode } from "../../theme/color-mode";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchemaKitchenChef } from "../../validation";
import { toaster } from "../ui/toaster";

export default function KitchenRegisterChef() {
  /* ---------------state----------------- */
  const { colorMode } = useColorMode();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  } = useForm({ resolver: yupResolver(registerSchemaKitchenChef) });

  const onSubmit = (data) => {
    const allDataRegisterChef = { role: "cooker", ...dataRegisterChef, ...data };
        toaster.create({
          title: "👨‍🍳 Chef account created successfully ",
          description:
            "Welcome to Tablya! Your chef profile is ready. Please log in to start managing your kitchen.",
          type: "success",
          duration: 3500,
        });
    console.log(allDataRegisterChef);

    reset();
  };

  return (
    <>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} spaceY={8}>
        {/* Kitchen Name */}
        <Field.Root invalid={!!errors.KitchenName}>
          <Field.Label
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
            mb={2}
          >
            Kitchen Name
            <Text as="span" color="#FA2c23">
              *
            </Text>
          </Field.Label>
          <InputGroup startElement={<TbToolsKitchen2 />}>
            <Input
              rounded="20px"
              placeholder="Enter your kitchen name"
              bg={bgInput}
              border="1px solid"
              borderColor={colorMode === "light" ? "gray.200" : "transparent"}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              _placeholder={{ color: "gray.500" }}
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
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              fontWeight="medium"
              mb={2}
            >
              Working Hours
              <Text as="span" color="#FA2c23">
                *
              </Text>
            </Field.Label>
          </Field.Root>

          <Flex gap="4" direction={{ base: "column", md: "row" }}>
            {/* Start Time */}
            <Field.Root invalid={!!errors.StartTime} flex={1}>
              <Field.Label
                fontSize="sm"
                mb={2}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                Start Time
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<MdAccessTime />}>
                <Input
                  rounded="20px"
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
                fontSize="sm"
                mb={2}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                End Time
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<MdAccessTime />}>
                <Input
                  rounded="20px"
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
                  {...register("EndTime")}
                />
              </InputGroup>
              <Field.ErrorText fontWeight="bold">
                {errors.EndTime?.message}
              </Field.ErrorText>
            </Field.Root>
          </Flex>
        </Box>

        {/* Password */}
        <Field.Root flex={1} invalid={!!errors.password}>
          <Field.Label>
            Password{" "}
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
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              bg={bgInput}
              borderRadius="10px"
              pr="3rem"
              {...register("password")}
            />
          </InputGroup>
          <Field.ErrorText fontWeight="bold">
            {errors.password?.message}
          </Field.ErrorText>
        </Field.Root>

        {/* Confirm Password */}
        <Field.Root flex={1} invalid={!!errors.confirmPassword}>
          <Field.Label>
            Confirm Password
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
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              bg={bgInput}
              borderRadius="10px"
              pr="3rem"
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
          rounded="20px"
          color="white"
          fontWeight="bold"
          py={6}
          mt={6}
          _hover={{ bg: "#d91f17" }}
        >
          Create Chef Account
        </Button>

        {/* Login link */}
        <Text
          textAlign="center"
          color={
            colorMode === "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Already have an account?{" "}
          <Link
            fontWeight="bold"
            _focus={{ outline: "none" }}
            color="#FA2c23"
            href="#"
          >
            Login
          </Link>
        </Text>
      </Box>
    </>
  );
}
