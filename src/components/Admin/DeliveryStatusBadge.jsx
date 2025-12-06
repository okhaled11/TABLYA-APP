import { Badge, Flex } from "@chakra-ui/react";
import { BsCircleFill } from "react-icons/bs";
import { useCheckDeliveryOutForDeliveryQuery } from "../../app/features/Admin/ordersApi";

const DeliveryStatusBadge = ({ user, getBadgeColor }) => {
  const { data: activeDeliveryOrders, isLoading } =
    useCheckDeliveryOutForDeliveryQuery(user.id, {
      skip: user.role !== "delivery",
    });

  const isBusy =
    user.role === "delivery" && !isLoading && activeDeliveryOrders?.length > 0;

  const isAvailable =
    user.role === "delivery" &&
    !isLoading &&
    (!activeDeliveryOrders || activeDeliveryOrders.length === 0);

  return (
    <Flex align="center" gap={2}>
      {/* Role Badge */}
      <Badge
        style={{
          borderRadius: "20px",
          padding: "4px 8px",
          borderWidth: "1px",
        }}
        colorPalette={getBadgeColor(user.role)}
      >
        {user.role}
      </Badge>

      {isAvailable && (
        <Badge colorPalette="green" borderRadius="full" p="1" title="Available">
          <BsCircleFill size={8} />
        </Badge>
      )}

      {isBusy && (
        <Badge
          colorPalette="red"
          borderRadius="full"
          p="1"
          title="Out for delivery"
        >
          <BsCircleFill size={8} />
        </Badge>
      )}
    </Flex>
  );
};

export default DeliveryStatusBadge;
