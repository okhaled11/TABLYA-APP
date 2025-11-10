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
};

export default function OrderModal({ isOpen, onClose, order }) {
    console.log(order);
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

                <Separator />

                {/* Payment Details */}
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <GridItem>
                    <Text color="gray.500">Subtotal</Text>
                    <Text fontWeight="bold">${order.subtotal ?? 0}</Text>
                  </GridItem>
                  <GridItem>
                    <Text color="gray.500">Tax</Text>
                    <Text fontWeight="bold">${order.tax ?? 0}</Text>
                  </GridItem>
                  <GridItem>
                    <Text color="gray.500">Discount</Text>
                    <Text fontWeight="bold">-${order.discount ?? 0}</Text>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Text color="gray.500">Total</Text>
                    <Text fontWeight="bold" fontSize="lg" color="teal.500">
                      ${order.total ?? 0}
                    </Text>
                  </GridItem>
                </Grid>
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
