import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {
    Box, Card, CardBody, CardHeader, Heading
} from "@chakra-ui/react";




export default function UserGrowthChart() {

    const chart = useChart({
        data: [
            { chefs: 10, customer: 20, delivery: 12, month: "January" },
            { chefs: 95, customer: 70, delivery: 4, month: "February" },
            { chefs: 87, customer: 50, delivery: 5, month: "March" },
            { chefs: 88, customer: 60, delivery: 6, month: "May" },
            { chefs: 65, customer: 40, delivery: 12, month: "June" },
            { chefs: 90, customer: 80, delivery: 9, month: "August" },
        ],
        series: [{ name: "chefs", color: "teal.solid" }, { name: "customer", color: "yellow.solid" }, { name: "delivery", color: "orange.solid" }],
    })


    return (
        <Card.Root
           my={"20px"}
            borderRadius="xl"
            shadow="sm"
            border="none"


            h="auto"
            w={"100%"}
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
                                axisLine={false}
                                dataKey={chart.key("month")}
                                tickFormatter={(value) => value.slice(0, 3)}
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
