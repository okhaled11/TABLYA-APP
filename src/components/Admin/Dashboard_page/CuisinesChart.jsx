import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, LabelList, Pie, PieChart, Tooltip } from "recharts"
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
} from "@chakra-ui/react";

import { useColorMode } from "../../../theme/color-mode";


export default function CuisinesChart() {

    const chart = useChart({
        data: [
            { name: "windows", value: 400, color: "blue.solid" },
            { name: "mac", value: 300, color: "orange.solid" },
            { name: "linux", value: 300, color: "pink.solid" },
            { name: "other", value: 200, color: "green.solid" },
        ],
    })


    const { colorMode } = useColorMode();

    return (
        <Card.Root
            bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
            borderRadius="xl"
            shadow="sm"
            border="none"


            h="400px"
            w={"50%"}
        >
            <CardHeader>
                <Heading fontSize="18px" fontWeight="semibold">
                    Top Performing Cuisines
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%" h="300px">
                    <Chart.Root boxSize="320px" mx="auto" chart={chart}>
                        <PieChart>
                            <Tooltip
                                cursor={false}
                                animationDuration={100}
                                content={<Chart.Tooltip hideLabel />}
                            />
                            <Pie
                                isAnimationActive={false}
                                data={chart.data}
                                dataKey={chart.key("value")}
                            >
                                <LabelList position="inside" fill="white" stroke="none" />
                                {chart.data.map((item) => (
                                    <Cell key={item.name} fill={chart.color(item.color)} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Chart.Root>
                </Box>
            </CardBody>
        </Card.Root>
    )
}
