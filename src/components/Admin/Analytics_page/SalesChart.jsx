import React, { useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { useColorMode } from "../../../theme/color-mode";
import { useGetSalesTrendQuery } from "../../../app/features/Admin/dashboardApi";

export default function SalesChart() {
  const { data: salesTrend = [], isLoading } = useGetSalesTrendQuery();
  const { colorMode } = useColorMode();

  // معالجة البيانات
  const chartData = useMemo(() => {
    if (!salesTrend.length) return [];
    return salesTrend.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      revenue: item.revenue || 0,
    }));
  }, [salesTrend]);

  // إنشاء الشارت
  const chart = useChart({
    data: chartData,
    series: [{ name: "revenue", color: "teal.solid" }],
  });

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Card.Root
      bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
      borderRadius="xl"
      shadow="sm"
      border="none"
      my="20px"
      h="500px"
      w="100%"
    >
      <CardHeader>
        <Heading fontSize="18px" fontWeight="semibold">
          Sales Trend (This Month)
        </Heading>
      </CardHeader>

      <CardBody>
        <Box w="100%" h="350px">
          <ResponsiveContainer width="100%" height="100%">
            <Chart.Root chart={chart}>
              <BarChart data={chart.data}>
                <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
                <XAxis
                  dataKey={chart.key("date")}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  domain={[0, 3000]} // المدى لحد 3000 زي ما طلبتِ قبل كده
                  tickFormatter={(value) => `${value}`}
                  label={{ value: "Revenue", angle: -90, position: "insideLeft", dy: 30 }}
                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                {chart.series.map((item) => (
                  <Bar
                    key={item.name}
                    isAnimationActive={false}
                    dataKey={chart.key(item.name)}
                    fill={chart.color(item.color)}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </Chart.Root>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}
