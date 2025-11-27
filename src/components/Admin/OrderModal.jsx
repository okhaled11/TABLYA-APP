"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  HStack,
  Portal,
  Text,
  VStack,
  Separator,
  Grid,
  GridItem,
} from "@chakra-ui/react";
    

const statusColors = {
  confirmed: "blue",
  preparing: "orange",
  ready_for_pickup: "yellow",
  out_for_delivery: "cyan",
  delivered: "green",
  cancelled: "red",
  created: "gray",
};

export default function OrderModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg">
            <Dialog.Header>
              <Dialog.Title>Order Details</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack align="stretch" spacing={5}>
                {/* Status */}
                <HStack justify="space-between">
                  <Text fontWeight="medium">Status:</Text>
                  <Badge
                    colorPalette={statusColors[order.status] || "gray"}
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {order.status?.replaceAll("_", " ") || "Unknown"}
                  </Badge>
                </HStack>

                <Separator />

                {/* Customer Info */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Customer
                  </Text>
                  <HStack spacing={3}>
                    <Avatar.Root size="sm">
                      <Avatar.Image
                        src={order.customer?.users?.avatar_url || null}
                        alt={order.customer?.users?.name || "Customer"}
                      />
                      <Avatar.Fallback
                        name={order.customer?.users?.name || "Customer"}
                      />
                    </Avatar.Root>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">
                        {order.customer?.users?.name || "N/A"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {order.customer?.users?.email || "N/A"}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Cooker Info */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Cooker
                  </Text>
                  <HStack spacing={3}>
                    <Avatar.Root size="sm">
                      <Avatar.Image
                        src={order.cooker?.users?.avatar_url || null}
                        alt={order.cooker?.users?.name || "Cooker"}
                      />
                      <Avatar.Fallback
                        name={order.cooker?.users?.name || "Cooker"}
                      />
                    </Avatar.Root>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">
                        {order.cooker?.users?.name || "N/A"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {order.cooker?.users?.email || "N/A"}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Delivery Info (if available) */}
                {order.delivery && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Delivery Partner
                    </Text>
                    <HStack spacing={3}>
                      <Avatar.Root size="sm">
                        <Avatar.Image
                          src={order.delivery?.users?.avatar_url || null}
                          alt={order.delivery?.users?.name || "Delivery"}
                        />
                        <Avatar.Fallback
                          name={order.delivery?.users?.name || "Delivery"}
                        />
                      </Avatar.Root>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {order.delivery?.users?.name || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.delivery?.users?.email || "N/A"}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}

                <Separator />

                {/* Address & Order Info */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Delivery Details
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    <GridItem>
                      <Text color="gray.500">Type</Text>
                      <Text fontWeight="medium">{order.type}</Text>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500">Delivery Type</Text>
                      <Text fontWeight="medium">
                        {order.delivery_type || "N/A"}
                      </Text>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text color="gray.500">Address</Text>
                      <Text fontWeight="medium">{order.address || "N/A"}</Text>
                    </GridItem>
                  </Grid>
                </Box>

                <Separator />

                {/* Payment Details */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Payment
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    <GridItem>
                      <Text color="gray.500">Method</Text>
                      <Text fontWeight="medium">
                        {order.payment_method || "N/A"}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500">Status</Text>
                      <Text
                        fontWeight="medium"
                        color={
                          order.payment_status === "paid"
                            ? "green.500"
                            : "orange.500"
                        }
                      >
                        {order.payment_status || "N/A"}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>

                <Separator />

                {/* Financial Summary */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Summary
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    <GridItem>
                      <Text color="gray.500">Subtotal</Text>
                      <Text fontWeight="bold">${order.subtotal ?? 0}</Text>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500">Discount</Text>
                      <Text fontWeight="bold">-${order.discount ?? 0}</Text>
                    </GridItem>
                    <GridItem>
                      <Text color="gray.500">Delivery Fee</Text>
                      <Text fontWeight="bold">${order.delivery_fee ?? 0}</Text>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text color="gray.500">Total</Text>
                      <Text fontWeight="bold" fontSize="lg" color="teal.500">
                        ${order.total ?? 0}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>

                <Separator />

                {/* Notes */}
                {order.notes && (
                  <Box>
                    <Text fontWeight="semibold" mb={1}>
                      Notes
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {order.notes}
                    </Text>
                  </Box>
                )}

                {/* Timestamps */}
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Created: {new Date(order.created_at).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Updated: {new Date(order.updated_at).toLocaleString()}
                  </Text>
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
