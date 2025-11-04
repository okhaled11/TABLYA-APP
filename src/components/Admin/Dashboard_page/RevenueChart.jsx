import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts";
import {
    Box, Card, CardBody, CardHeader, Heading
} from "@chakra-ui/react";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import { useColorMode } from "../../../theme/color-mode";

export default function RevenueChart() {


    const chart = useChart({
        data: [
            { Customers: 10, month: "January" },
            { Customers: 95, month: "February" },
            { Customers: 87, month: "March" },
            { Customers: 88, month: "May" },
            { Customers: 65, month: "June" },
            { Customers: 90, month: "August" },
        ],
        series: [{ name: "Customers", color: "teal.solid" }],
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
                    Revenue Trend
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%" h="300px">
                    <ResponsiveContainer width="100%" height="100%">

                        <Chart.Root maxH="sm" chart={chart}>
                            <LineChart data={chart.data}>
                                <CartesianGrid stroke={chart.color("border")} vertical={false} />
                                <XAxis
                                    axisLine={false}
                                    dataKey={chart.key("month")}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    stroke={chart.color("border")}
                                    label={{ value: "Month", position: "bottom" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    stroke={chart.color("border")}
                                    label={{ value: "Customers", position: "left", angle: -90 }}
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
                    </ResponsiveContainer>
                </Box>
            </CardBody>
        </Card.Root>
    )
}
