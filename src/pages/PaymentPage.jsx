import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  StripeProvider,
  PaymentForm,
  CheckoutButton,
  PaymentHistory,
} from '../components/payment';

/**
 * Payment Page Component
 * Example page showing different payment methods
 */
const PaymentPage = () => {
  const toast = useToast();
  const [amount] = useState(29.99);

  const handlePaymentSuccess = (paymentIntent) => {
    toast({
      title: 'Payment Successful',
      description: `Payment of $${amount} completed successfully!`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    console.log('Payment successful:', paymentIntent);
  };

  const handlePaymentError = (error) => {
    toast({
      title: 'Payment Failed',
      description: error,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  // Example line items for checkout
  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Example Product',
          description: 'This is an example product',
        },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    },
  ];

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Payment Options</Heading>

        <Tabs isFitted variant="enclosed" colorScheme="blue">
          <TabList mb={4}>
            <Tab>Card Payment</Tab>
            <Tab>Checkout</Tab>
            <Tab>Payment History</Tab>
          </TabList>

          <TabPanels>
            {/* Card Payment Tab */}
            <TabPanel>
              <Box
                maxW="md"
                mx="auto"
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
              >
                <StripeProvider>
                  <PaymentForm
                    amount={amount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    metadata={{
                      order_id: 'order_123',
                      customer_id: 'cust_456',
                    }}
                  />
                </StripeProvider>
              </Box>
            </TabPanel>

            {/* Checkout Tab */}
            <TabPanel>
              <Box
                maxW="md"
                mx="auto"
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Heading size="md">Checkout Session</Heading>
                  <Box>
                    <p>Amount: ${amount}</p>
                    <p>This will redirect you to Stripe Checkout</p>
                  </Box>
                  <StripeProvider>
                    <CheckoutButton
                      lineItems={lineItems}
                      successUrl={`${window.location.origin}/payment/success`}
                      cancelUrl={`${window.location.origin}/payment/cancel`}
                      w="100%"
                    >
                      Pay ${amount} with Checkout
                    </CheckoutButton>
                  </StripeProvider>
                </VStack>
              </Box>
            </TabPanel>

            {/* Payment History Tab */}
            <TabPanel>
              <Box
                p={8}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
              >
                <PaymentHistory />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default PaymentPage;
