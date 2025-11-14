import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Check if it's an email confirmation error
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          toast({
            title: 'Email Not Confirmed',
            description: 'Please check your email and click the confirmation link before logging in.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Login Failed',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
        return;
      }

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: 'Google Sign In Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Sign In</Heading>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          w="100%"
          isLoading={loading}
        >
          Sign In
        </Button>

        <HStack w="100%">
          <Divider />
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            OR
          </Text>
          <Divider />
        </HStack>

        <Button
          variant="outline"
          w="100%"
          onClick={handleGoogleSignIn}
          isLoading={loading}
        >
          Continue with Google
        </Button>

        <Text fontSize="sm" color="gray.600">
          Don't have an account?{' '}
          <Text
            as="span"
            color="blue.500"
            cursor="pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default LoginForm;
