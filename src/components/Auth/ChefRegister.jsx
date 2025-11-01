import { Container, Box } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import KitchenRegisterChef from "./KitchenRegisterChef";
import { PersonalRegisterChef } from "./personalRegisterChef";

function CustomerRegister() {
  /* ---------------state----------------- */
  const [currentStep, setCurrentStep] = useState(2);
  /* ---------------variable----------------- */
  const nextStepHandler = () => {
    setCurrentStep((prev) => prev + 1);
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
          <PersonalRegisterChef nextStepHandler={nextStepHandler} />
        )}
        {/* Step 2: Chef Information */}
        {currentStep === 2 && <KitchenRegisterChef />}
      </Container>
    </>
  );
}

export default CustomerRegister;
