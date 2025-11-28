import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import CookerStaticsCard from "../cooker/CookerStaticsCard";
import { RiFileList3Fill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { PiMoneyWavyFill } from "react-icons/pi";
import { useState, useEffect, useMemo } from "react";
import { useGetOrdersForDeliveryCityQuery } from "../../app/features/delivery/deleveryOrder";
import { supabase } from "../../services/supabaseClient";

const DeliveryStatistics = () => {
  const { colorMode } = useColorMode();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);
  const { data: orders = [], isLoading } = useGetOrdersForDeliveryCityQuery();
  const isToday = (d) => {
    if (!d) return false;
    const t = new Date();
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  };
  const activeDeliveries = useMemo(
    () => (orders || []).filter((o) => o.status === "ready_for_pickup").length,
    [orders]
  );
  const completedToday = useMemo(
    () =>
      (orders || []).filter(
        (o) =>
          o.status === "delivered" &&
          o.delivery_id === userId &&
          isToday(new Date(o.updated_at || o.created_at))
      ).length,
    [orders, userId]
  );
  const earningsToday = useMemo(() => {
    return (orders || []).reduce((sum, o) => {
      if (
        o.status === "delivered" &&
        o.delivery_id === userId &&
        isToday(new Date(o.updated_at || o.created_at))
      ) {
        const fee = Number(o.delivery_fee ?? 0);
        return sum + (Number.isFinite(fee) ? fee : 0);
      }
      return sum;
    }, 0);
  }, [orders, userId]);
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Number(n || 0));

  return (
    <>
      <Box py={6}>
        <Heading
          size="lg"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          my={4}
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Statistics
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <CookerStaticsCard
            title="Active Deliveries"
            value={activeDeliveries}
            icon={TbTruckDelivery}
            iconBg={
              colorMode === "light"
                ? colors.light.warning10a
                : colors.dark.warning10a
            }
            iconColor={
              colorMode === "light" ? colors.light.warning : colors.dark.warning
            }
          />
          <CookerStaticsCard
            title="Completed Today"
            value={completedToday}
            icon={BsFillBoxSeamFill}
            iconBg={
              colorMode === "light"
                ? colors.light.success10a
                : colors.dark.success10a
            }
            iconColor={
              colorMode === "light" ? colors.light.success : colors.dark.success
            }
          />
          <CookerStaticsCard
            title="Earnings Today (LE)"
            value={fmt(earningsToday)}
            icon={PiMoneyWavyFill}
            iconBg={
              colorMode === "light" ? colors.light.info10a : colors.dark.info10a
            }
            iconColor={
              colorMode === "light" ? colors.light.info : colors.dark.info
            }
          />
        </SimpleGrid>
      </Box>
    </>
  );
};

export default DeliveryStatistics;
