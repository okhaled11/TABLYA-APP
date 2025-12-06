import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {
    Box, Card, CardBody, CardHeader, Heading
} from "@chakra-ui/react";


import { useGetUserGrowthByTypeQuery } from '../../../app/features/Admin/dashboardApi';
import { useColorMode } from '../../../theme/color-mode';
import colors from '../../../theme/color';

export default function UserGrowthChart() {
    const { colorMode } = useColorMode();
    const { data: userGrowth } = useGetUserGrowthByTypeQuery();
    

    const chart = useChart({
        data: userGrowth,
        series: [{ name: "cooker", color: "teal.solid" }, { name: "customer", color: "yellow.solid" }, { name: "delivery", color: "orange.solid" }],
    })


    return (
        <Card.Root
            my={"20px"}
            borderRadius="xl"
            shadow="sm"
            border="none"
            h="auto"
            w={"100%"}
            bg={colorMode === "light" ? "white" : colors.dark.bgThird}
        >
            <CardHeader>
                <Heading fontSize="18px" fontWeight="semibold">
                    User Growth by Type
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%">

                    <Chart.Root maxH="sm" chart={chart}>
                        <LineChart data={chart.data}>
                            <CartesianGrid stroke={chart.color("border")} vertical={false} />
                            <XAxis
                               
                                dataKey="month"

                                axisLine={false}
                                tickLine={false}
                                stroke={chart.color("border")}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                stroke={chart.color("border")}
                            />
                            <Tooltip
                                animationDuration={100}
                                cursor={false}
                                content={<Chart.Tooltip />}
                            />
                            {chart.series.map((item) => (
                                <Line
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    stroke={chart.color(item.color)}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}





                        </LineChart>







                    </Chart.Root>
                </Box>
            </CardBody>
        </Card.Root>





    )
}
