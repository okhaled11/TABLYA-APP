import { useMemo, useState } from "react";
import { useColorStyles } from "../../hooks/useColorStyles";
import { Box, Grid, Text, Tabs, Flex, Image } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetCookerMonthlyOrdersQuery,
  useGetCookerWeeklyOrdersQuery,
  useGetCookerDailyOrdersQuery,
} from "../../app/features/Cooker/CookerAnalytics";
import srcLoadingImg from "../../assets/Transparent Version.gif";

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper function to get current week number
const getCurrentWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};

// Helper function to get days in month
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const formatWeekLabel = (weekKey) => {
  if (!weekKey) return "Week";
  const number = weekKey.replace("week", "");
  return `Week ${number}`;
};

export const CookerAnalytics = () => {
  const colors = useColorStyles();
  const bgCard = colors.bgThird;
  const textColor = colors.textSub;

  const currentDate = useMemo(() => new Date(), []);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentWeek = getCurrentWeekNumber();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.toString());
  const [selectedDay, setSelectedDay] = useState(currentDay.toString());
  const [selectedDayMonth, setSelectedDayMonth] = useState(
    currentMonth.toString()
  );

  // Monthly query
  const {
    data: monthlyData,
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
    error: errorMonthly,
    refetch: refetchMonthly,
    isFetching: isFetchingMonthly,
  } = useGetCookerMonthlyOrdersQuery({
    month: Number(selectedMonth),
    year: currentYear,
  });

  // Weekly query
  const {
    data: weeklyData,
    isLoading: isLoadingWeekly,
    isError: isErrorWeekly,
    error: errorWeekly,
    refetch: refetchWeekly,
    isFetching: isFetchingWeekly,
  } = useGetCookerWeeklyOrdersQuery({
    week: Number(selectedWeek),
    year: currentYear,
  });

  // Daily query
  const {
    data: dailyData,
    isLoading: isLoadingDaily,
    isError: isErrorDaily,
    error: errorDaily,
    refetch: refetchDaily,
    isFetching: isFetchingDaily,
  } = useGetCookerDailyOrdersQuery({
    month: Number(selectedDayMonth),
    year: currentYear,
    day: Number(selectedDay),
  });

  const weeklyOrders = useMemo(() => {
    if (!monthlyData?.weeklyOrders) return [];
    return monthlyData.weeklyOrders.map((item) => ({
      name: formatWeekLabel(item.week),
      orders: item.orders,
    }));
  }, [monthlyData?.weeklyOrders]);

  const dailyOrders = useMemo(() => {
    if (!weeklyData?.dailyOrders) return [];
    return weeklyData.dailyOrders.map((item) => ({
      name: item.day.substring(0, 3), // Short day name
      orders: item.orders,
    }));
  }, [weeklyData?.dailyOrders]);

  const hourlyOrders = useMemo(() => {
    if (!dailyData?.hourlyOrders) return [];
    return dailyData.hourlyOrders
      .filter((item) => item.orders > 0)
      .map((item) => ({
        name: item.hour,
        orders: item.orders,
      }));
  }, [dailyData?.hourlyOrders]);

  const totalOrdersMonthly = monthlyData?.totalOrders ?? 0;
  const totalOrdersWeekly = weeklyData?.totalOrders ?? 0;
  const totalOrdersDaily = dailyData?.totalOrders ?? 0;

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleDayMonthChange = (event) => {
    setSelectedDayMonth(event.target.value);
    setSelectedDay("1");
  };

  const renderLoading = () => (
    <Image
      boxSize={{ base: 32, md: 40 }}
      mx={"auto"}
      rounded="md"
      src={srcLoadingImg}
      alt="Loading"
    />
  );

  const renderError = (error, refetch) => (
    <Flex direction="column" align="center" py={6} gap={3}>
      <Text
        color="red.400"
        fontWeight="medium"
        fontSize={{ base: "sm", md: "md" }}
        textAlign="center"
      >
        {error?.message || "Failed to load analytics data."}
      </Text>
      <Text
        as="button"
        onClick={refetch}
        color={colors.mainFixed}
        fontWeight="bold"
        fontSize={{ base: "sm", md: "md" }}
      >
        Try again
      </Text>
    </Flex>
  );

  const renderMonthly = () => {
    if (isLoadingMonthly || isFetchingMonthly) return renderLoading();
    if (isErrorMonthly) return renderError(errorMonthly, refetchMonthly);
    if (!weeklyOrders.length) {
      return (
        <Flex justify="center" align="center" py={8}>
          <Text
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
          >
            No orders recorded for this month yet.
          </Text>
        </Flex>
      );
    }

    return (
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 4, md: 6 }}
      >
        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          overflow="hidden"
        >
          <Text
            fontWeight="bold"
            mb={3}
            color={textColor}
            fontSize={{ base: "md", md: "lg" }}
          >
            Weekly Orders
          </Text>
          <Box w="100%" h={{ base: "220px", sm: "250px", md: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyOrders}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a0000" />
                <XAxis
                  dataKey="name"
                  stroke={colors.textSub}
                  fontSize={{ base: 10, sm: 12 }}
                  tickMargin={5}
                />
                <YAxis
                  stroke={colors.textSub}
                  allowDecimals={false}
                  fontSize={{ base: 10, sm: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Orders"]}
                  contentStyle={{
                    backgroundColor: "#2b0000",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#ff2e2e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          color={textColor}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          minH={{ base: "200px", md: "auto" }}
        >
          <Box w={"fit"} h={"fit"} textAlign={"center"}>
            <Text fontSize={{ base: "md", md: "lg" }} mb={2}>
              Total Orders This Month
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              color={colors.mainFixed}
            >
              {totalOrdersMonthly}
            </Text>
          </Box>
        </Box>
      </Grid>
    );
  };

  const renderWeekly = () => {
    if (isLoadingWeekly || isFetchingWeekly) return renderLoading();
    if (isErrorWeekly) return renderError(errorWeekly, refetchWeekly);
    if (!dailyOrders.length) {
      return (
        <Flex justify="center" align="center" py={8}>
          <Text
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
          >
            No orders recorded for this week yet.
          </Text>
        </Flex>
      );
    }

    return (
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 4, md: 6 }}
      >
        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          overflow="hidden"
        >
          <Text
            fontWeight="bold"
            mb={3}
            color={textColor}
            fontSize={{ base: "md", md: "lg" }}
          >
            Daily Orders
          </Text>
          <Box w="100%" h={{ base: "220px", sm: "250px", md: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyOrders}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a0000" />
                <XAxis
                  dataKey="name"
                  stroke={colors.textSub}
                  fontSize={{ base: 10, sm: 12 }}
                  tickMargin={5}
                />
                <YAxis
                  stroke={colors.textSub}
                  allowDecimals={false}
                  fontSize={{ base: 10, sm: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Orders"]}
                  contentStyle={{
                    backgroundColor: "#2b0000",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#ff2e2e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          textAlign="center"
          color={textColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH={{ base: "200px", md: "auto" }}
        >
          <Box>
            <Text fontSize={{ base: "md", md: "lg" }} mb={2}>
              Total Orders This Week
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              color={colors.mainFixed}
            >
              {totalOrdersWeekly}
            </Text>
          </Box>
        </Box>
      </Grid>
    );
  };

  const renderDaily = () => {
    if (isLoadingDaily || isFetchingDaily) return renderLoading();
    if (isErrorDaily) return renderError(errorDaily, refetchDaily);
    if (!hourlyOrders.length) {
      return (
        <Flex justify="center" align="center" py={8}>
          <Text
            color={textColor}
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
          >
            No orders recorded for this day yet.
          </Text>
        </Flex>
      );
    }

    return (
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 4, md: 6 }}
      >
        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          overflow="hidden"
        >
          <Text
            fontWeight="bold"
            mb={3}
            color={textColor}
            fontSize={{ base: "md", md: "lg" }}
          >
            Hourly Orders
          </Text>
          <Box w="100%" h={{ base: "220px", sm: "250px", md: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyOrders}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a0000" />
                <XAxis
                  dataKey="name"
                  stroke={colors.textSub}
                  fontSize={{ base: 10, sm: 12 }}
                  tickMargin={5}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={colors.textSub}
                  allowDecimals={false}
                  fontSize={{ base: 10, sm: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Orders"]}
                  contentStyle={{
                    backgroundColor: "#2b0000",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#ff2e2e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          bg={bgCard}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="lg"
          textAlign="center"
          color={textColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH={{ base: "200px", md: "auto" }}
        >
          <Box>
            <Text fontSize={{ base: "md", md: "lg" }} mb={2}>
              Total Orders This Day
            </Text>
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              color={colors.mainFixed}
            >
              {totalOrdersDaily}
            </Text>
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <Box p={{ base: 3, sm: 4, md: 6 }}>
      <Tabs.Root defaultValue="monthly">
        <Tabs.List
          mb={4}
          flexWrap={{ base: "nowrap", sm: "wrap" }}
          overflowX={{ base: "auto", sm: "visible" }}
        >
          <Tabs.Trigger
            value="daily"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 3, md: 4 }}
          >
            Daily
          </Tabs.Trigger>
          <Tabs.Trigger
            value="weekly"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 3, md: 4 }}
          >
            Weekly
          </Tabs.Trigger>
          <Tabs.Trigger
            value="monthly"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 3, md: 4 }}
          >
            Monthly
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="daily">
          <Box mb={6}>
            <Grid
              templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
              gap={{ base: 3, md: 4 }}
            >
              <Box>
                <Text
                  color={textColor}
                  mb={2}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Select Month
                </Text>
                <Box
                  as="select"
                  value={selectedDayMonth}
                  onChange={handleDayMonthChange}
                  w="100%"
                  bg={colors.bgThird}
                  border="none"
                  rounded="xl"
                  color={colors.textMain}
                  p={{ base: 2, md: 3 }}
                  cursor="pointer"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {monthLabels.map((label, index) => (
                    <option
                      key={label}
                      color={colors.textMain}
                      value={(index + 1).toString()}
                    >
                      {label}
                    </option>
                  ))}
                </Box>
              </Box>
              <Box>
                <Text
                  color={textColor}
                  mb={2}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Select Day
                </Text>
                <Box
                  as="select"
                  value={selectedDay}
                  onChange={handleDayChange}
                  w="100%"
                  bg={colors.bgThird}
                  border="none"
                  rounded="xl"
                  color={colors.textMain}
                  p={{ base: 2, md: 3 }}
                  cursor="pointer"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {Array.from(
                    {
                      length: getDaysInMonth(
                        Number(selectedDayMonth),
                        currentYear
                      ),
                    },
                    (_, i) => i + 1
                  ).map((day) => (
                    <option
                      key={day}
                      value={day.toString()}
                      color={colors.textMain}
                    >
                      {day}
                    </option>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Box>
          {renderDaily()}
        </Tabs.Content>

        <Tabs.Content value="weekly">
          <Box mb={6}>
            <Text color={textColor} mb={2} fontSize={{ base: "sm", md: "md" }}>
              Select Week (1-52)
            </Text>
            <Box
              as="select"
              value={selectedWeek}
              onChange={handleWeekChange}
              maxW={{ base: "100%", sm: "240px" }}
              bg={colors.bgThird}
              border="none"
              rounded="xl"
              color={colors.textMain}
              p={{ base: 2, md: 3 }}
              cursor="pointer"
              fontSize={{ base: "sm", md: "md" }}
            >
              {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
                <option
                  key={week}
                  value={week.toString()}
                  color={colors.textMain}
                >
                  Week {week}
                </option>
              ))}
            </Box>
          </Box>
          {renderWeekly()}
        </Tabs.Content>

        <Tabs.Content value="monthly">
          <Box mb={6}>
            <Text color={textColor} mb={2} fontSize={{ base: "sm", md: "md" }}>
              Select Month
            </Text>
            <Box
              as="select"
              value={selectedMonth}
              onChange={handleMonthChange}
              maxW={{ base: "100%", sm: "240px" }}
              bg={colors.bgThird}
              border="none"
              rounded="xl"
              color={colors.textMain}
              p={{ base: 2, md: 3 }}
              cursor="pointer"
              fontSize={{ base: "sm", md: "md" }}
            >
              {monthLabels.map((label, index) => (
                <option
                  key={label}
                  value={(index + 1).toString()}
                  color={colors.textMain}
                >
                  {label}
                </option>
              ))}
            </Box>
          </Box>
          {renderMonthly()}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
