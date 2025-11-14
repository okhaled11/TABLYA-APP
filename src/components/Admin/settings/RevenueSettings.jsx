import React, { useState } from 'react'
import { Box, Card, CardBody, CardHeader, FieldLabel, Heading, HStack, Text } from '@chakra-ui/react'
import { NumberInput } from "@chakra-ui/react"
import { Progress } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { ToggleTip } from '../../ui/toggle-tip'
import { LuInfo } from "react-icons/lu"
import { Status } from "@chakra-ui/react"
import { useEffect } from 'react'
import { supabase } from '../../../services/supabaseClient'

import { useUpdateSettingsMutation } from '../../../app/features/Admin/MariamSettings'
import MariamCustomModal from '../ChefVeri_page/MariamModal'
import { toaster } from '../../ui/toaster'
import colors from '../../../theme/color'
import { useColorMode } from '../../../theme/color-mode'
export default function RevenueSettings() {
    const {colorMode}=useColorMode();
    const [platformComm, setPlatformComm] = useState(0);
    const [chefcomm, setChefComm] = useState(0);
    const [servicefee, setservice] = useState(0);

    //state for confirmation Modal 
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [progress, setprogress] = useState();



    const [updateSettings, { data, error, isLoading, isSuccess }] = useUpdateSettingsMutation();


    const handleSavechanges = async () => {

        //     console.log({
        //     platformProfit: Number(platformComm) || 0,
        //     chefcommesion: Number(chefcomm) || 0,
        //     servicefee: Number(servicefee) || 0,
        //     delivery: 0
        //   });


        const response = await updateSettings({
            platform_commission_pct: Number(platformComm) || 0,
            chef_commission_pct: Number(chefcomm) || 0,
            service_fee_amount: Number(servicefee) || 0,
            default_delivery_fee: 0
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
    }

    const handleReset = async () => {
        const newValues = {
            platform_commission_pct: 10,
            chef_commission_pct: 80,
            service_fee_amount: 10,
            default_delivery_fee: 0
        };

        // update UI
        setPlatformComm(newValues.platform_commission_pct);
        setChefComm(newValues.chef_commission_pct);
        setservice(newValues.service_fee_amount);

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
        const progressPercentage = Number(platformComm) + Number(chefcomm) + Number(servicefee);
        setprogress(progressPercentage);
    }, [platformComm, chefcomm, servicefee]);


    //handling values in inputs during mounting 
    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase
                .from("platform_settings")
                .select("*")
                .eq("id", "b63fcd43-7207-4ddf-a735-24467a0293dc")
                .single();

            setPlatformComm(data.platform_commission_pct);
            setChefComm(data.chef_commission_pct);
            setservice(data.service_fee_amount);
        }

        fetchSettings();
    }, []);





    return (
        <Box my={"20px"} bg={colorMode ==="light" ? "white" : colors.dark.bgThird  }>

            <Card.Root size="lg" bg={colorMode ==="light" ? "white" : colors.dark.bgThird  }>
                <Card.Header>

                    {/* headings */}
                    <Heading size="xl"> Revenue & Commission Settings </Heading>
                    <Text color={"GrayText"}>Configure how revenue is distributed across the platform</Text>
                </Card.Header>
                <Card.Body color="fg.muted">
                    {/* percentages */}
                    <HStack gap={"20"}>
                        <Box>
                            <HStack>

                                <Heading my={"10px"} size={"md"}>Platform Commission (%)</Heading>
                                <ToggleTip content="Percentage of each order taken as platform commission">
                                    <Button size="xs" variant="ghost">
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>

                            </HStack>

                            <NumberInput.Root value={platformComm} width="300px" min={1} max={100} size={"lg"} borderRadius={"30px"} onValueChange={(e) => setPlatformComm(e.value || 0)}>
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>


                        </Box>
                        {/* chef commesion */}
                        <Box>
                            <HStack>

                                <Heading my={"10px"} size={"md"}>Chef Share (%) </Heading>
                                <ToggleTip content="Percentage of each order that goes to the chef">
                                    <Button size="xs" variant="ghost">
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>


                            </HStack>

                            <NumberInput.Root width="300px" min={1} max={100} size={"lg"} borderRadius={"30px"} onValueChange={(e) => setChefComm(e.value)} value={chefcomm}>
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>


                        </Box>


                        <Box>
                            <HStack>

                                <Heading my={"10px"} size={"md"}>Service Fee (%)</Heading>
                                <ToggleTip content="System maintenance and support fee" >
                                    <Button size="xs" variant="ghost">
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>

                            </HStack>

                            <NumberInput.Root value={servicefee} width="300px" min={1} max={100} size={"lg"} borderRadius={"30px"} onValueChange={(e) => setservice(e.value)}>
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>


                        </Box>


                    </HStack>


                    {/* progress */}
                    <Text color={"GrayText"} mt={"20px"} >Revenue Distribution</Text>
                    <Progress.Root value={progress} maxW={"5xl"} my={"10px"} colorPalette={'red'}>
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
                            Service: {servicefee}%
                        </Status.Root>

                    </HStack>

                    <Text my={"20px"} color={"red"}>Total percentage cannot exceed 100%</Text>
                    <HStack>
                        {/* save changes and reset btns */}
                        <Button color={"white"} bg={"rgb(250, 44, 35)"} onClick={() => setIsConfirmOpen(true)}>Save changes</Button>
                        <Button  variant="surface"  onClick={() => setIsResetConfirmOpen(true)}>Reset to Default</Button>

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
                message="Are you sure you want to save the changes ?"   //prop will be passed 

            />

            {/* modal for Reset using mariam custom modal */}
            <MariamCustomModal
                isOpen={isResetConfirmOpen}
                onClose={() => setIsResetConfirmOpen(false)}
                type="approve"
                onApprove={handleReset}
                isApproving={isLoading}
                cooker={{ user: { name: "Platform Settings" } }}     //fake data because we have condition in modal 
                message="Are you sure you want to reset settings to the default?"

            />


        </Box>
    )
}
