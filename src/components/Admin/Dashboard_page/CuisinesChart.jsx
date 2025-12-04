import React from 'react'
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, LabelList, Pie, PieChart, Tooltip } from "recharts"
import {
    Box, Card, CardBody, CardHeader, Heading,
} from "@chakra-ui/react";
import { useMemo } from 'react';

import { useColorMode } from "../../../theme/color-mode";
import { useGetTopPerformingCuisinesQuery } from '../../../app/features/Admin/dashboardApi';


export default function CuisinesChart() {

    const { data: topCuisine = [], isLoading } = useGetTopPerformingCuisinesQuery();
    const chartData = useMemo(() => {
        if (!topCuisine.length) return [];
        const colors = ["rgb(231, 114, 64)", "rgb(13, 148, 136)", "#ef4444", "rgb(244, 192, 37)", "rgb(177, 82, 224)"];
        return topCuisine.map((item, index) => ({
            name: item.title || "Unknown",
            value: item.count || 0,
            kitchen: item.kitchen_name || "_",
            color: colors[index % colors.length],
        }));
    }, [topCuisine]);
    console.log(chartData);

    const chart = useChart({ data: chartData });



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
                    Top 5 Best-Selling Dishes
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%" h="300px">
                    <Chart.Root boxSize="320px" mx="auto" chart={chart} >
                        <PieChart width={300} height={300}>
                            {/* <Tooltip
                                cursor={false}
                                animationDuration={100}
                                content={<Chart.Tooltip hideLabel />}
                               
                            /> */}

                            <Tooltip
                                cursor={false}
                                animationDuration={100}
                                content={({ payload }) => {
                                    if (!payload || !payload.length) return null;

                                    const slice = payload[0];
                                    const data = slice.payload;
                                    const color = slice.fill || slice.payload.color;

                                    return (
                                        <Box
                                            bg="rgba(255, 255, 255, 0.95)"
                                            backdropFilter="blur(4px)"
                                            border="1px solid #eee"
                                            borderRadius="10px"
                                            p="10px 14px"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                                            fontSize="14px"
                                            minW="140px"
                                        >
                                            {/* Title Row with Color Dot */}
                                            <Box display="flex" alignItems="center" gap="8px" mb="6px">
                                                <Box
                                                    w="10px"
                                                    h="10px"
                                                    borderRadius="50%"
                                                    bg={color}
                                                />
                                                <Box fontWeight="600" color="#111">
                                                    {data.name}
                                                </Box>
                                            </Box>

                                            <Box color="#444" mb="2px">
                                               Kitchen: <strong>{data.kitchen}</strong>
                                            </Box>

                                            <Box color="#444">
                                                Orders: <strong>{data.value}</strong>
                                            </Box>
                                        </Box>
                                    );
                                }}
                            />

                            <Pie
                                isAnimationActive={false}
                                data={chartData}
                                dataKey="value"
                            >
                                <LabelList position="inside" fill="white" stroke="none" />
                                {chartData.map((item) => (
                                    <Cell key={item.name} fill={item.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Chart.Root>
                </Box>
            </CardBody>
        </Card.Root>
    )
}
