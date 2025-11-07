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
import { useMemo } from 'react';

import { useColorMode } from "../../../theme/color-mode";
import { useGetTopPerformingCuisinesQuery } from '../../../app/features/Admin/dashboardApi';


export default function CuisinesChart() {

    const { data: topCuisine = [], isLoading } = useGetTopPerformingCuisinesQuery();
    const chartData = useMemo(() => {
        if (!topCuisine.length) return [];
        const colors = ["#14b8a6", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];
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
                    Top Performing Cuisines
                </Heading>
            </CardHeader>

            <CardBody>
                <Box w="100%" h="300px">
                    <Chart.Root boxSize="320px" mx="auto" chart= {chart} >
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
                                    <Cell key={item.name} fill={item.color}/>
                                ))}
                            </Pie>
                        </PieChart>
                    </Chart.Root>
                </Box>
            </CardBody>
        </Card.Root>
    )
}
