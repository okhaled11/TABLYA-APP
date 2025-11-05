import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
} from "@chakra-ui/react";

import { useColorMode } from "../../../theme/color-mode";

export default function SalesChart() {
    const chart = useChart({
        data: [
            { allocation: 60, type: "Stock" },
            { allocation: 45, type: "Crypto" },
            { allocation: 12, type: "ETF" },
            { allocation: 4, type: "Cash" },
        ],
        series: [{ name: "allocation", color: "orange.solid" }],
    })


    const { colorMode } = useColorMode();
    return (

        <Card.Root
            bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
            borderRadius="xl"
            shadow="sm"
            border="none"

            my={"20px"}
            h="500px"
            w={"100%"}
        >
            <CardHeader>
                <Heading fontSize="18px" fontWeight="semibold">
                   Sales Trend (This Month)
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%" h="300px">

                    <Chart.Root maxH="sm" chart={chart}>
                        <BarChart data={chart.data}>
                            <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
                            <XAxis axisLine={false} tickLine={false} dataKey={chart.key("type")} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            {chart.series.map((item) => (
                                <Bar
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    fill={chart.color(item.color)}
                                />
                            ))}
                        </BarChart>
                    </Chart.Root>

                </Box>
            </CardBody>
        </Card.Root>
    )
}
