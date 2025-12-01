import React, { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  FieldLabel,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import { NumberInput } from "@chakra-ui/react";
import { Progress } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ToggleTip } from "../../ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { Status } from "@chakra-ui/react";
import { useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";

import { useUpdateSettingsMutation } from "../../../app/features/Admin/MariamSettings";
import MariamCustomModal from "../ChefVeri_page/MariamModal";
import { toaster } from "../../ui/toaster";
import colors from "../../../theme/color";
import { useColorMode } from "../../../theme/color-mode";
import TaxesInfo from "../TaxesInfo";
export default function RevenueSettings() {
  const { colorMode } = useColorMode();
  const [platformComm, setPlatformComm] = useState(0);
  const [chefcomm, setChefComm] = useState(0);
  const [customerfee, setcustomerfee ] = useState(0);

  //state for confirmation Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [progress, setprogress] = useState();

  //----------------------------------------------------------------
  const [salesTax, setSalesTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);


  const [updateSettings, { data, error, isLoading, isSuccess }] =
    useUpdateSettingsMutation();

  const handleSavechanges = async () => {
    //     console.log({
    //     platformProfit: Number(platformComm) || 0,
    //     chefcommesion: Number(chefcomm) || 0,
    //     servicefee: Number(servicefee) || 0,
    //     delivery: 0
    //   });

    const response = await updateSettings({
      platform_commission_pct: Number(platformComm) || 0,
      chef_fee_pct: Number(chefcomm) || 0,
      customer_fee_pct: Number(customerfee) || 0,
      default_delivery_fee: Number(deliveryFee) || 0,

      //-----------------------------------------------
      sales_tax_pct: Number(salesTax),
      min_order_value: Number(minOrder),
      free_delivery_threshold: Number(freeDeliveryThreshold),
    });

    if (response.error) {
      toaster.create({
        title: "Update failed",
        description: error.message,
        type: "error",
      });
      return;
    }

    setIsConfirmOpen(false);

    toaster.create({
      title: "Settings updated",
      description: "Platform settings were updated successfully.",
      type: "success",
    });
  };

  const handleReset = async () => {
    const newValues = {
      platform_commission_pct: 10,
      chef_fee_pct: 80,
      customer_fee_pct: 10,
      

      //-----------------------------------------------
      sales_tax_pct: 10,
      default_delivery_fee: 0,
      minimum_order_value: 200,
      free_delivery_threshold: 500,
    };

    // update UI
    setPlatformComm(newValues.platform_commission_pct);
    setChefComm(newValues.chef_fee_pct);
    setcustomerfee(newValues.customer_fee_pct);

    setSalesTax(newValues.sales_tax_pct);
    setDeliveryFee(newValues.default_delivery_fee);
    setMinOrder(newValues.minimum_order_value);
    setFreeDeliveryThreshold(newValues.free_delivery_threshold);

    // send to API
    const response = await updateSettings(newValues);
    if (response.error) {
      toaster.create({
        title: "Reset failed",
        description: error.message,
        type: "error",
      });
      return;
    }

    setIsResetConfirmOpen(false);

    toaster.create({
      title: "Settings Reset",
      description: "Platform settings were Reseted to default successfully.",
      type: "success",
    });
  };

  //handling progress changing

  useEffect(() => {
    const progressPercentage =
      Number(platformComm) + Number(chefcomm) + Number(customerfee);
    setprogress(progressPercentage);
  }, [platformComm, chefcomm, customerfee]);

  //handling values in inputs during mounting
  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("id", "b63fcd43-7207-4ddf-a735-24467a0293dc")
        .single();

      setPlatformComm(data.platform_commission_pct);
      setChefComm(data.chef_fee_pct);
      setservice(data.service_fee_amount);
      setSalesTax(data.sales_tax_pct);
      setDeliveryFee(data.default_delivery_fee);
      setMinOrder(data.minimum_order_value);
      setFreeDeliveryThreshold(data.free_delivery_threshold);
      // console.log(data);
    }

    fetchSettings();
  }, []);

  return (
    <Box my={"20px"} bg={colorMode === "light" ? "white" : colors.dark.bgThird}>
      <Card.Root
        size="lg"
        bg={colorMode === "light" ? "white" : colors.dark.bgThird}
      >
        <Card.Header>
          {/* headings */}
          <Heading size="xl"> Revenue & Commission Settings </Heading>
          <Text color={"GrayText"}>
            Configure how revenue is distributed across the platform
          </Text>
        </Card.Header>
        <Card.Body color="fg.muted">
          {/* percentages */}
          <HStack gap={"20"}>
            <Box flex={1}>
              <HStack>
                <Heading my={"10px"} size={"md"}>
                  Platform Commission (%)
                </Heading>
                <ToggleTip content="Percentage of each order taken as platform commission">
                  <Button size="xs" variant="ghost">
                    <LuInfo />
                  </Button>
                </ToggleTip>
              </HStack>

              <NumberInput.Root
                value={platformComm}
                // width="300px"
                width={"100%"}
                min={1}
                max={100}
                size={"lg"}
                colorPalette={"orange"}
                // borderRadius={"30px"}
                onValueChange={(e) => setPlatformComm(e.value || 0)}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"} />
              </NumberInput.Root>
            </Box>


            {/* chef commesion */}
            <Box flex={1}>
              <HStack>
                <Heading my={"10px"} size={"md"}>
                  Chef Share (%){" "}
                </Heading>
                <ToggleTip content="Percentage of each order that goes to the chef">
                  <Button size="xs" variant="ghost">
                    <LuInfo />
                  </Button>
                </ToggleTip>
              </HStack>

              <NumberInput.Root
                // width="300px"
                width={"100%"}
                min={1}
                max={100}
                size={"lg"}
                // borderRadius={"30px"}
                onValueChange={(e) => setChefComm(e.value)}
                value={chefcomm}
                colorPalette={"orange"}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"}/>
              </NumberInput.Root>









            </Box>

            <Box flex={1}>
              <HStack>
                <Heading my={"10px"} size={"md"}>
                  Customer Fee (%)
                </Heading>
                <ToggleTip content="A small charge added to the customer's order.">
                  <Button size="xs" variant="ghost">
                    <LuInfo />
                  </Button>
                </ToggleTip>
              </HStack>

              <NumberInput.Root
                value={customerfee}
                // width="300px"
                width={"100%"}
                min={1}
                max={100}
                size={"lg"}
                borderRadius={"30px"}
                onValueChange={(e) => setcustomerfee(e.value)}
                colorPalette={"orange"}
              >
                <NumberInput.Control />
                <NumberInput.Input borderRadius={"10px"}/>
              </NumberInput.Root>
            </Box>
          </HStack>

          {/* progress */}
          <Text color={"GrayText"} mt={"20px"}>
            Revenue Distribution
          </Text>
          <Progress.Root
            value={progress}
            maxW={"5xl"}
            my={"10px"}
            colorPalette={"red"}
          >
            <HStack gap="5">
              <Progress.Track flex="1" height="16px" borderRadius="lg">
                <Progress.Range />
              </Progress.Track>
              <Progress.ValueText>{progress}%</Progress.ValueText>
            </HStack>
          </Progress.Root>

          {/* status */}

          <HStack gap="6">
            <Status.Root size={"lg"} colorPalette="orange">
              <Status.Indicator />
              Platform: {platformComm}%
            </Status.Root>
            <Status.Root size={"lg"} colorPalette="green">
              <Status.Indicator />
              Chef: {chefcomm}%
            </Status.Root>
            <Status.Root size={"lg"} colorPalette="yellow">
              <Status.Indicator />
              Customer: {customerfee}%
            </Status.Root>
          </HStack>

          <Text my={"20px"} color={"red"}>
            Total percentage cannot exceed 100%
          </Text>
          <TaxesInfo
            salesTax={salesTax}
            setSalesTax={setSalesTax}
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            minOrder={minOrder}
            setMinOrder={setMinOrder}
            freeDeliveryThreshold={freeDeliveryThreshold}
            setFreeDeliveryThreshold={setFreeDeliveryThreshold}
          />
          <HStack>
            {/* save changes and reset btns */}
            <Button
              color={"white"}
              bg={"rgb(250, 44, 35)"}
              onClick={() => setIsConfirmOpen(true)}
            >
              Save changes
            </Button>
            <Button
              variant="surface"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              Reset to Default
            </Button>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* modal for confirmation using mariam custom modal */}
      <MariamCustomModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        type="approve"
        onApprove={handleSavechanges}
        isApproving={isLoading}
        cooker={{ user: { name: "Platform Settings" } }} //fake data not used beacause we have condition in modal
        message="Are you sure you want to save the changes ?" //prop will be passed
      />

      {/* modal for Reset using mariam custom modal */}
      <MariamCustomModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        type="approve"
        onApprove={handleReset}
        isApproving={isLoading}
        cooker={{ user: { name: "Platform Settings" } }} //fake data because we have condition in modal
        message="Are you sure you want to reset settings to the default?"
      />
    </Box>
  );
}
