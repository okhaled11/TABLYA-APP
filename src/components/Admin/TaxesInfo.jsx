import {
  Box,
  Field,
  Heading,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useColorMode } from "../../theme/color-mode";

export default function TaxesInfo({
  salesTax,
  setSalesTax,
  deliveryFee,
  setDeliveryFee,
  minOrder,
  setMinOrder,
  freeDeliveryThreshold,
  setFreeDeliveryThreshold,
}) {
 

  return (
    <>
      <Box
        borderRadius={"10px"}
        // borderWidth={"1px"}
        marginBlock={10}
      >
        <Heading>Taxes & Fees</Heading>
        <Text color={"gray.500"}>Configure tax rates and delivery charges</Text>
        <SimpleGrid
          gap="10"
          marginBlockStart={"5"}
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        >
          <Box flex="1">
            <Field.Root>
              <Field.Label>Sales Tax / VAT (%)</Field.Label>
              <NumberInput.Root
                value={salesTax}
                onValueChange={(e) => setSalesTax(e.value)}
                width="100%"
                colorPalette={"orange"}
                min={0}
                max={100}
                step={1}
                size="sm"
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"} />
              </NumberInput.Root>
            </Field.Root>
          </Box>
          <Box flex="1">
            <Field.Root>
              <Field.Label>Delivery Fee (Flat Rate)</Field.Label>
              <NumberInput.Root
                value={deliveryFee}
                onValueChange={(e) => setDeliveryFee(e.value)}
                width="100%"
                colorPalette={"orange"}
                // formatOptions={{
                //   style: "currency",
                //   currency: "EGP",
                //   currencyDisplay: "code",
                //   currencySign: "accounting",
                // }}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"} />
              </NumberInput.Root>
            </Field.Root>
          </Box>
          <Box flex="1">
            <Field.Root>
              <Field.Label>Minimum Order Value</Field.Label>
              <NumberInput.Root
                value={minOrder}
                onValueChange={(e) => setMinOrder(e.value)}
                width="100%"
                colorPalette={"orange"}
                // formatOptions={{
                //   style: "currency",
                //   currency: "EGP",
                //   currencyDisplay: "code",
                //   currencySign: "accounting",
                // }}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"} />
              </NumberInput.Root>
            </Field.Root>
          </Box>
          <Box flex="1">
            <Field.Root>
              <Field.Label>Free Delivery Threshold</Field.Label>
              <NumberInput.Root
                width="100%"
                value={freeDeliveryThreshold}
                onValueChange={(e) => setFreeDeliveryThreshold(e.value)}
                colorPalette={"orange"}
                // formatOptions={{
                //   style: "currency",
                //   currency: "EGP",
                //   currencyDisplay: "code",
                //   currencySign: "accounting",
                // }}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"} />
              </NumberInput.Root>
            </Field.Root>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
}
