import React, { useEffect, useMemo, useState } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import CookerStaticsCard from "./CookerStaticsCard";
import { FiMenu } from "react-icons/fi";
import { FaMoneyBillWave, FaStar } from "react-icons/fa";
import { TbSoup } from "react-icons/tb";
import { PiMoneyWavyFill } from "react-icons/pi";
import { RiFileList3Fill } from "react-icons/ri";
import { useGetCookerOrdersQuery } from "../../app/features/cooker/CookerAcceptOrder";
import { useGetMyMenuItemsQuery } from "../../app/features/cooker/CookerMenuApi";
import { useGetCookerByIdQuery } from "../../app/features/Customer/CookersApi";
import { supabase } from "../../services/supabaseClient";
const CookerStatistics = () => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setUserId(user?.id || null);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const { colorMode } = useColorMode();

  const { data: orders = [], isLoading: ordersLoading } =
    useGetCookerOrdersQuery();
  const { data: menuItems = [], isLoading: menuLoading } =
    useGetMyMenuItemsQuery();
  const { data: cookerDetails, isLoading: cookerLoading } =
    useGetCookerByIdQuery(userId, { skip: !userId });

  const totalOrders = useMemo(() => {
    if (!orders || orders.length === 0) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return orders.filter((order) => {
      const created = order?.created_at ? new Date(order.created_at) : null;
      if (!created) return false;
      return (
        created.getMonth() === currentMonth &&
        created.getFullYear() === currentYear
      );
    }).length;
  }, [orders]);

  const monthlyEarning = useMemo(() => {
    if (!orders || orders.length === 0) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Build quick lookup for chef_profit by menu item id (and title as fallback)
    const profitById = new Map(
      (menuItems || []).map((m) => [m.id, Number(m.chef_profit || 0)])
    );
    const profitByTitle = new Map(
      (menuItems || []).map((m) => [m.title, Number(m.chef_profit || 0)])
    );

    let sum = 0;
    for (const order of orders) {
      const created = order?.created_at ? new Date(order.created_at) : null;
      if (!created) continue;
      if (
        created.getMonth() === currentMonth &&
        created.getFullYear() === currentYear
      ) {
        const items = order?.order_items || [];
        for (const it of items) {
          const qty = Number(it.quantity || 0);
          const profitPer =
            profitById.get(it.menu_item_id) ?? profitByTitle.get(it.title) ?? 0;
          sum += qty * profitPer;
        }
      }
    }
    return Math.round(sum);
  }, [orders, menuItems]);

  const activeMeals = useMemo(
    () =>
      menuItems ? menuItems.filter((m) => m.available === true).length : 0,
    [menuItems]
  );
  const outOfStock = useMemo(
    () =>
      menuItems ? menuItems.filter((m) => (m.stock ?? 0) === 0).length : 0,
    [menuItems]
  );

  const avgRating = cookerDetails?.avg_rating ?? 0;
  const totalReviews = cookerDetails?.total_reviews ?? 0;

  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Number(n || 0));

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
      <CookerStaticsCard
        title="Total Orders"
        value={totalOrders}
        loading={ordersLoading}
        icon={RiFileList3Fill}
        iconBg={
          colorMode === "light" ? colors.light.info20a : colors.dark.info20a
        }
        iconColor={colorMode === "light" ? colors.light.info : colors.dark.info}
      />

      <CookerStaticsCard
        title="Monthly Earning (LE)"
        value={fmt(monthlyEarning)}
        loading={ordersLoading}
        icon={PiMoneyWavyFill}
        iconBg={
          colorMode === "light"
            ? colors.light.success20a
            : colors.dark.success20a
        }
        iconColor={
          colorMode === "light" ? colors.light.success : colors.dark.success
        }
      />

      <CookerStaticsCard
        title="Active Meals"
        value={activeMeals}
        subtext={`${outOfStock} out of stock`}
        loading={menuLoading}
        icon={TbSoup}
        iconBg={
          colorMode === "light"
            ? colors.light.pending20a
            : colors.dark.pending20a
        }
        iconColor={
          colorMode === "light" ? colors.light.pending : colors.dark.pending
        }
      />

      <CookerStaticsCard
        title="Ratings"
        value={avgRating || 0}
        subtext={`${totalReviews} reviews`}
        loading={cookerLoading}
        icon={FaStar}
        iconBg={
          colorMode === "light"
            ? colors.light.warning20a
            : colors.dark.warning20a
        }
        iconColor={
          colorMode === "light" ? colors.light.warning : colors.dark.warning
        }
      />
    </SimpleGrid>
  );
};

export default CookerStatistics;
