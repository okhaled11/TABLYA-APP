import { Container, For, Stack, Box } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FileUpload, Icon } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { Field, HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

function CustomerRegister() {
  /* ---------------state----------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const { colorMode } = useColorMode();
  /* ---------------variable----------------- */
  const testError = false;
  const bgInput =
    colorMode == "light" ? colors.light.bgInput : colors.dark.bgInput;

  /* ---------------Handler----------------- */
  const submitHandler = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    console.log("Creating Chef Account");
  };

  return (
    <>
      <Container>
        {/* Progress Indicators */}
        <Flex justify="center" gap={2} mb={6}>
          <Box w="60px" h="4px" bg="#FA2c23" rounded="full" />
          <Box
            w="60px"
            h="4px"
            bg={currentStep === 2 ? "#FA2c23" : "gray.300"}
            rounded="full"
          />
        </Flex>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Box as="form" onSubmit={submitHandler} spaceY={4}>
            {/*  full name */}
            <Flex gap="4" direction={{ base: "column", md: "row" }}>
              <Field.Root invalid={testError}>
                <Field.Label>First Name</Field.Label>
                <InputGroup startElement={<FaUser />}>
                  <Input
                    rounded={"20px        "}
                    placeholder="Enter your first name"
                    bg={bgInput}
                  />
                </InputGroup>
                <Field.ErrorText fontWeight={"bold"}>
                  This is an error text
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={testError}>
                <Field.Label>Last Name</Field.Label>
                <InputGroup startElement={<FaUser />}>
                  <Input
                    rounded={"20px"}
                    placeholder="Enter your last name"
                    bg={bgInput}
                  />
                </InputGroup>
                <Field.ErrorText fontWeight={"bold"}>
                  This is an error text
                </Field.ErrorText>
              </Field.Root>
            </Flex>

            {/* email */}
            <Field.Root invalid={testError}>
              <Field.Label>Email</Field.Label>
              <InputGroup startElement={<MdEmail />}>
                <Input
                  rounded={"20px"}
                  placeholder="Enter your email"
                  bg={bgInput}
                />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>
            {/* Phone */}
            <Field.Root invalid={testError}>
              <Field.Label>Phone</Field.Label>
              <InputGroup startElement={<FaPhoneAlt />}>
                <Input
                  rounded={"20px"}
                  placeholder="Enter your phone number"
                  bg={bgInput}
                />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>
            {/* ID Verification */}
            <Field.Root invalid={testError}>
              <Field.Label>ID Verification </Field.Label>
              <FileUpload.Root alignItems="stretch" maxFiles={10}>
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone
                  rounded="xl"
                  border="2px dashed"
                  borderColor="gray.300"
                  p={6}
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                >
                  <Icon size="md" color="fg.muted">
                    <LuUpload />
                  </Icon>
                  <FileUpload.DropzoneContent>
                    <Box>Upload your government ID</Box>
                    <Box color="fg.muted">Choose File</Box>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
              </FileUpload.Root>
            </Field.Root>
            <Button bg={"#FA2c23"} type="submit" w={"100%"} rounded={"20px"}>
              Continue
            </Button>
            <Text textAlign={"center"}>
              Already have an account ?
              <Link
                fontWeight={"bold"}
                ms={1}
                _focus={{ outline: "none" }}
                color={"#FA2c23"}
                href="#"
              >
                Login
              </Link>
            </Text>
          </Box>
        )}

        {/* Step 2: Chef Information */}
        {currentStep === 2 && (
          <Box as="form" onSubmit={submitHandler} spaceY={4}>
            {/* Kitchen Name */}
            <Field.Root invalid={testError}>
              <Field.Label
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Kitchen Name{" "}
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<GiKnifeFork />}>
                <Input
                  rounded={"20px"}
                  placeholder="Enter your kitchen nam        e"
                  bg={bgInput}
                  border="1px solid"
                  borderColor={
                    colorMode === "light" ? "gray.200" : "transparent"
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{ color: "gray.500" }}
                />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>

            {/* Working Hours */}
            <Box>
              <Text
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                bg={bgInput}
                mb={2}
                fontWeight="medium"
              >
                Working Hours
              </Text>
              <Flex gap="4" direction={{ base: "column", md: "row" }}>
                <Field.Root invalid={testError} flex={1}>
                  <Field.Label
                    fontSize="sm"
                    mb={2}
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                    bg={bgInput}
                  >
                    Start Time
                    <Text as="span" color="#FA2c23">
                      *
                    </Text>
                  </Field.Label>
                  <InputGroup startElement={<MdAccessTime />}>
                    <Input
                      rounded={"20px"}
                      type="time"
                      placeholder="--:--:--"
                      bg={bgInput}
                      border="1px solid"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "transparent"
                      }
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      _placeholder={{ color: "gray.500" }}
                    />
                  </InputGroup>
                </Field.Root>
                <Field.Root invalid={testError} flex={1}>
                  <Field.Label
                    fontSize="sm"
                    bg={bgInput}
                    mb={2}
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    End Time
                    <Text as="span" color="#FA2c23">
                      *
                    </Text>
                  </Field.Label>
                  <InputGroup startElement={<MdAccessTime />}>
                    <Input
                      rounded={"20px"}
                      type="time"
                      placeholder="--:--:--"
                      bg={bgInput}
                      border="1px solid"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "transparent"
                      }
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      _placeholder={{ color: "gray.500" }}
                    />
                  </InputGroup>
                </Field.Root>
              </Flex>
            </Box>

            {/* Password */}
            <Field.Root invalid={testError}>
              <Field.Label
                bg={bgInput}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mb={2}
              >
                Password{" "}
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<RiLockPasswordFill />}>
                <Input
                  rounded={"20px"}
                  type="password"
                  placeholder="Enter your password"
                  bg={bgInput}
                  border="1px solid"
                  borderColor={
                    colorMode === "light" ? "gray.200" : "transparent"
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{ color: "gray.500" }}
                />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>

            {/* Confirm Password */}
            <Field.Root invalid={testError}>
              <Field.Label
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                bg={bgInput}
                mb={2}
              >
                Confirm Password
                <Text as="span" color="#FA2c23">
                  *
                </Text>
              </Field.Label>
              <InputGroup startElement={<RiLockPasswordFill />}>
                <Input
                  rounded={"20px"}
                  type="password"
                  placeholder="Confirm your password"
                  bg={bgInput}
                  border="1px solid"
                  borderColor={
                    colorMode === "light" ? "gray.200" : "transparent"
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{ color: "gray.500" }}
                />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>

            <Button
              bg={"#FA2c23"}
              type="submit"
              w={"100%"}
              rounded={"20px"}
              color="white"
              fontWeight="bold"
              py={6}
              mt={6}
              _hover={{ bg: "#d91f17" }}
            >
              Create Chef Account
            </Button>
            <Text
              textAlign={"center"}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              Already have an account?
              <Link
                fontWeight={"bold"}
                _focus={{ outline: "none" }}
                color={"#FA2c23"}
                href="#"
              >
                Login
              </Link>
            </Text>
          </Box>
        )}
      </Container>
    </>
  );
}

export default CustomerRegister;
