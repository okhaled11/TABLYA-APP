
import React, { useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import {Box,Card,CardBody,CardHeader,Heading
} from "@chakra-ui/react";
import { Spinner, Text, VStack } from "@chakra-ui/react"
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer
} from "recharts";

import { useColorMode } from "../../../theme/color-mode";
import { useGetRevenueTrendQuery } from "../../../app/features/Admin/dashboardApi";

export default function RevenueChart() {
    const { colorMode } = useColorMode();

    //get data from supabase 
    const { data: salesTrend = [], isLoading } = useGetRevenueTrendQuery();

    // chart hook
    const chart = useChart({
        data: salesTrend,
        series: [{ name: "revenue", color: "teal.solid" }],
    });

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
                    {isLoading ? (
                        <VStack colorPalette="teal">
                            <Spinner color="colorPalette.600" />
                            <Text color="colorPalette.600">Loading...</Text>
                        </VStack>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <Chart.Root maxH="sm" chart={chart}>
                                <LineChart data={chart.data}>
                                    <CartesianGrid
                                        stroke={chart.color("border")}
                                        vertical={false}
                                    />
                                    <XAxis
                                        axisLine={false}
                                        dataKey="month"
                                        tickFormatter={(value) => value}
                                        stroke={chart.color("border")}
                                        label={{ value: "Week", position: "bottom" }}
                                        interval={0} //to preview all months 
                                        angle={-30}  //to make them with angle
                                    />
                                    <YAxis
                                        dataKey="revenue"
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={20}

                                        domain={[0, 3000]}
                                        stroke={chart.color("border")}
                                        label={{
                                            value: "Revenue (EGP)",
                                            position: "left",
                                            angle: -90,
                                        }}
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
                                            stroke="#14b8a6"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </Chart.Root>
                        </ResponsiveContainer>
                    )}
                </Box>
            </CardBody>
        </Card.Root>
    );
}


