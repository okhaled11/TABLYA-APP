import React, { useMemo } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Box, Card, CardBody, CardHeader, Heading, Spinner, Center,
} from "@chakra-ui/react";

import { useColorMode } from "../../../theme/color-mode";
import { useGetSalesTrendQuery } from "../../../app/features/Admin/dashboardApi";

export default function SalesChart() {
  const { data: salesTrend = [], isLoading } = useGetSalesTrendQuery();
  const { colorMode } = useColorMode();

  //for managing data 
  const chartData = useMemo(() => {
    if (!salesTrend.length) return [];
    return salesTrend.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      revenue: item.revenue || 0,
    }));
  }, [salesTrend]);

  //create chart 
  const chart = useChart({
    data: chartData,
    series: [{ name: "revenue", color: "rgb(250, 44, 35)" }],
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
                 
                  // domain={[0, 3000]}
                  domain={[0, Math.max(...chartData.map(d => d.revenue)) * 1.1]}  //for values in y axis to be depend on true value
                  // tickFormatter={(value) => `${value}`}
                  label={{ value: "Revenue (EGP)", angle: -90, position: "insideLeft", dy: 30 }}
                  tickMargin={2} //to not get out of the card
                  width={60}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}

                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} formatter={(value) => `${value} EGP`} />
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
