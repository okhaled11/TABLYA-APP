import { Container, For, Stack, Box } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FileUpload, Icon } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "@chakra-ui/react";

/* form */

import { Flex, Text } from "@chakra-ui/react";
import { Field, HStack, Input } from "@chakra-ui/react";
import { InputGroup } from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";

/* after */

function CustomerRegister() {
  /* get */
  const testError = false;
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("ok");
  };

  return (
    <>
      <Container>
        <Box as="form" onSubmit={submitHandler} spaceY={4}>
          {/*  full name */}
          <Flex gap="4" direction={{ base: "column", md: "row" }}>
            <Field.Root invalid={testError}>
              <Field.Label>First Name</Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input rounded={"20px"} placeholder="Enter your first name" />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={testError}>
              <Field.Label>Last Name</Field.Label>
              <InputGroup startElement={<FaUser />}>
                <Input rounded={"20px"} placeholder="Enter your last name" />
              </InputGroup>
              <Field.ErrorText fontWeight={"bold"}>
                This is an error text
              </Field.ErrorText>
            </Field.Root>
          </Flex>
          {/* middle */}
          {/* email */}
          <Field.Root invalid={testError}>
            <Field.Label>Email</Field.Label>
            <InputGroup startElement={<MdEmail />}>
              <Input rounded={"20px"} placeholder="Enter your email" />
            </InputGroup>
            <Field.ErrorText fontWeight={"bold"}>
              This is an error text
            </Field.ErrorText>
          </Field.Root>
          {/* Phone */}
          <Field.Root invalid={testError}>
            <Field.Label>Phone</Field.Label>
            <InputGroup startElement={<FaPhoneAlt />}>
              <Input rounded={"20px"} placeholder="Enter your phone number" />
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
            <Link fontWeight={"bold"} ms={1} color={"#FA2c23"} href="#">
              Login
            </Link>{" "}
          </Text>
        </Box>
      </Container>
    </>
  );
}

export default CustomerRegister;
