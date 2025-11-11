import { useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
} from '@chakra-ui/react';
import { XCircle } from '@phosphor-icons/react';

/**
 * Payment Cancel Page Component
 * Displayed when payment is canceled
 */
const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8}>
        <Icon as={XCircle} boxSize={20} color="red.500" weight="fill" />
        
        <Heading textAlign="center" color="red.500">
          Payment Canceled
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          Your payment has been canceled. No charges have been made to your account.
        </Text>

        <VStack spacing={3} w="100%">
          <Button
            colorScheme="blue"
            size="lg"
            w="100%"
            onClick={() => navigate('/payment')}
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            w="100%"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default PaymentCancelPage;
