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
        const colors = [ "rgb(231, 114, 64)","rgb(13, 148, 136)", "#ef4444", "rgb(244, 192, 37)", "rgb(177, 82, 224)"];
        return topCuisine.map((item, index) => ({
            name: item.title || "Unknown",
            value: item.count || 0,
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
                            <Tooltip
                                cursor={false}
                                animationDuration={100}
                                content={<Chart.Tooltip hideLabel />}
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
