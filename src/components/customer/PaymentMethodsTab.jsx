import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  IconButton,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  Separator,
  Grid,
  GridItem,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { Trash, Plus, CreditCard as CreditCardIcon, Pen } from "@phosphor-icons/react";
import { useState } from "react";
import { useColorStyles } from "../../hooks/useColorStyles";
import IconBox from "../ui/IconBox";
import FormField from "../ui/FormField";

export default function PaymentMethodsTab({ isLoading }) {
  const styles = useColorStyles();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPrimaryPayment, setIsPrimaryPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expireDate: "",
    cvv: "",
  });

  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      cardNumber: "**** **** **** 4242",
      cardHolder: "John Doe",
      isPrimary: true,
    },
    {
      id: 2,
      type: "MasterCard",
      cardNumber: "**** **** **** 5687",
      cardHolder: "Jane Smith",
      isPrimary: false,
    },
    {
      id: 3,
      type: "Cash On Delivery",
      cardNumber: "",
      cardHolder: "",
      isPrimary: false,
    },
  ]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(" ") : cleaned;
  };

  // Format expiration date
  const formatExpireDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSavePayment = () => {
    // Reset errors
    setPaymentErrors({
      cardNumber: "",
      cardHolder: "",
      expireDate: "",
      cvv: "",
    });

    // Validation
    let hasError = false;
    const errors = {
      cardNumber: "",
      cardHolder: "",
      expireDate: "",
      cvv: "",
    };

    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (!cleanedCardNumber) {
      errors.cardNumber = "Please enter card number";
      hasError = true;
    } else if (cleanedCardNumber.length !== 16) {
      errors.cardNumber = "Card number must be 16 digits";
      hasError = true;
    }

    if (!cardHolder.trim()) {
      errors.cardHolder = "Please enter card holder name";
      hasError = true;
    }

    if (!expireDate) {
      errors.expireDate = "Please enter expiration date";
      hasError = true;
    } else if (expireDate.length !== 5) {
      errors.expireDate = "Invalid date format (MM/YY)";
      hasError = true;
    }

    if (!cvv) {
      errors.cvv = "Please enter CVV";
      hasError = true;
    } else if (cvv.length !== 3) {
      errors.cvv = "CVV must be 3 digits";
      hasError = true;
    }

    if (hasError) {
      setPaymentErrors(errors);
      return;
    }

    if (editingPaymentId) {
      // Update existing payment method
      setPaymentMethods(
        paymentMethods.map((pm) => {
          if (pm.id === editingPaymentId) {
            return {
              ...pm,
              type: "Visa",
              cardNumber: `**** **** **** ${cleanedCardNumber.slice(-4)}`,
              cardHolder: cardHolder.trim(),
              isPrimary: isPrimaryPayment,
            };
          }
          return isPrimaryPayment ? { ...pm, isPrimary: false } : pm;
        })
      );
    } else {
      // Add new payment method
      const newPayment = {
        id: paymentMethods.length + 1,
        type: "Visa",
        cardNumber: `**** **** **** ${cleanedCardNumber.slice(-4)}`,
        cardHolder: cardHolder.trim(),
        isPrimary: isPrimaryPayment || paymentMethods.length === 0,
      };

      if (isPrimaryPayment) {
        setPaymentMethods([
          ...paymentMethods.map((pm) => ({ ...pm, isPrimary: false })),
          newPayment,
        ]);
      } else {
        setPaymentMethods([...paymentMethods, newPayment]);
      }
    }

    // Close dialog and reset
    setIsPaymentDialogOpen(false);
    setCardNumber("");
    setCardHolder("");
    setExpireDate("");
    setCvv("");
    setIsPrimaryPayment(false);
    setEditingPaymentId(null);
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
  };

  const handleSetPrimaryPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isPrimary: pm.id === id,
      }))
    );
  };

  const handleEditPayment = (payment) => {
    setEditingPaymentId(payment.id);
    setCardNumber(payment.cardNumber || "");
    setCardHolder(payment.cardHolder || "");
    setIsPrimaryPayment(payment.isPrimary);
    setIsPaymentDialogOpen(true);
  };

  return (
    <>
      <Box bg={styles.bgThird} borderRadius="25px" p={8}>
        <VStack spacing={6} align="stretch">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <HStack key={i} spacing={3} align="start">
                  <SkeletonCircle size="20px" mt={6} />
                  <Box flex={1}>
                    <Skeleton height="100px" borderRadius="12px" />
                  </Box>
                </HStack>
              ))}
              <Skeleton height="50px" borderRadius="12px" width="30%" alignSelf="center" />
            </>
          ) : (
            <>
              {/* Payment Methods List */}
              {paymentMethods.map((pm) => (
                <HStack key={pm.id} spacing={3} align="start">
                  {/* Radio Button */}
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    border={`2px solid ${pm.isPrimary ? styles.mainFixed : styles.border1}`}
                    bg={pm.isPrimary ? styles.mainFixed : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    cursor="pointer"
                    onClick={() => handleSetPrimaryPayment(pm.id)}
                    transition="all 0.2s"
                    _hover={{
                      transform: "scale(1.1)",
                      borderColor: styles.mainFixed,
                    }}
                    mt={6}
                  >
                    {pm.isPrimary && (
                      <Box w="8px" h="8px" borderRadius="full" bg="white" />
                    )}
                  </Box>

                  {/* Card */}
                  <Box
                    flex={1}
                    bg={styles.bgFourth}
                    borderRadius="12px"
                    p={5}
                    border={pm.isPrimary ? `2px solid ${styles.mainFixed}` : "none"}
                  >
                    <HStack justify="space-between" align="start">
                      <HStack spacing={3} flex={1} align="start">
                        <IconBox icon={CreditCardIcon} mt={1} />
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack>
                            <Text fontWeight="bold" color={styles.textMain}>
                              {pm.type}
                            </Text>
                            {pm.isPrimary && (
                              <Box
                                bg={styles.success20a}
                                color={styles.success}
                                px={2}
                                py={0.5}
                                borderRadius="full"
                                fontSize="xs"
                              >
                                Primary
                              </Box>
                            )}
                          </HStack>
                          {pm.cardNumber && (
                            <Text fontSize="sm" color={styles.textSub}>
                              {pm.cardNumber}
                            </Text>
                          )}
                          {pm.cardHolder && (
                            <Text fontSize="sm" color={styles.textSub}>
                              {pm.cardHolder}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      <HStack spacing={2}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          color={styles.textSub}
                          onClick={() => handleEditPayment(pm)}
                          _hover={{ bg: styles.bgFourth }}
                        >
                          <Pen size={18} />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          color={styles.error}
                          onClick={() => handleDeletePayment(pm.id)}
                          _hover={{ bg: styles.error10a }}
                        >
                          <Trash size={18} />
                        </IconButton>
                      </HStack>
                    </HStack>
                  </Box>
                </HStack>
              ))}

              {/* Add New Payment Method Button */}
              <Button
                width="50%"
                alignSelf="center"
                variant="outline"
                borderColor={styles.mainFixed}
                bg="transparent"
                color={styles.mainFixed}
                borderRadius="12px"
                size="lg"
                borderWidth="2px"
                leftIcon={<Plus size={20} weight="bold" />}
                onClick={() => setIsPaymentDialogOpen(true)}
                _hover={{ bg: styles.mainFixed10a }}
              >
                + Add Payment Method
              </Button>
            </>
          )}
        </VStack>
      </Box>

      {/* Add/Edit Payment Dialog */}
      <DialogRoot
        open={isPaymentDialogOpen}
        onOpenChange={(e) => {
          setIsPaymentDialogOpen(e.open);
          if (!e.open) {
            setCardNumber("");
            setCardHolder("");
            setExpireDate("");
            setCvv("");
            setIsPrimaryPayment(false);
            setEditingPaymentId(null);
            setPaymentErrors({
              cardNumber: "",
              cardHolder: "",
              expireDate: "",
              cvv: "",
            });
          }
        }}
        size="md"
      >
        <DialogBackdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <DialogContent
          bg={styles.bgThird}
          borderRadius="20px"
          maxW="500px"
          position="fixed"
          top="40%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <DialogHeader display="block" pb={2}>
            <DialogTitle color={styles.textMain} fontSize="xl">
              Add New Payment Method
            </DialogTitle>
            <Text fontSize="sm" color={styles.textSub} mt={1}>
              Enter your card details
            </Text>
          </DialogHeader>
          <DialogCloseTrigger />

          <Separator borderColor={styles.border1} />

          <DialogBody py={6}>
            <VStack spacing={5} align="stretch">
              <FormField
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  if (formatted.replace(/\s/g, "").length <= 16) {
                    setCardNumber(formatted);
                    if (paymentErrors.cardNumber) {
                      setPaymentErrors({ ...paymentErrors, cardNumber: "" });
                    }
                  }
                }}
                error={paymentErrors.cardNumber}
              />

              <FormField
                label="Card Holder"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => {
                  setCardHolder(e.target.value);
                  if (paymentErrors.cardHolder) {
                    setPaymentErrors({ ...paymentErrors, cardHolder: "" });
                  }
                }}
                error={paymentErrors.cardHolder}
              />

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormField
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={expireDate}
                    onChange={(e) => {
                      const formatted = formatExpireDate(e.target.value);
                      if (formatted.replace(/\D/g, "").length <= 4) {
                        setExpireDate(formatted);
                        if (paymentErrors.expireDate) {
                          setPaymentErrors({ ...paymentErrors, expireDate: "" });
                        }
                      }
                    }}
                    error={paymentErrors.expireDate}
                  />
                </GridItem>
                <GridItem>
                  <FormField
                    label="CVV"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 3) {
                        setCvv(value);
                        if (paymentErrors.cvv) {
                          setPaymentErrors({ ...paymentErrors, cvv: "" });
                        }
                      }
                    }}
                    error={paymentErrors.cvv}
                  />
                </GridItem>
              </Grid>

              {/* Primary Switch */}
              <Button
                variant="outline"
                borderColor={isPrimaryPayment ? styles.mainFixed : styles.border1}
                bg={isPrimaryPayment ? styles.mainFixed10a : "transparent"}
                color={isPrimaryPayment ? styles.mainFixed : styles.textMain}
                borderRadius="12px"
                size="lg"
                h="auto"
                py={3}
                px={4}
                onClick={() => setIsPrimaryPayment(!isPrimaryPayment)}
                transition="all 0.2s"
                _hover={{
                  bg: isPrimaryPayment ? styles.mainFixed10a : styles.bgFourth,
                  transform: "translateY(-1px)",
                  boxShadow: "md",
                }}
                _active={{ transform: "translateY(0)" }}
              >
                <HStack spacing={3} w="full">
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    border={`2px solid ${isPrimaryPayment ? styles.mainFixed : styles.border1}`}
                    bg={isPrimaryPayment ? styles.mainFixed : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {isPrimaryPayment && (
                      <Box w="8px" h="8px" borderRadius="full" bg="white" />
                    )}
                  </Box>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="bold">
                      Set as Primary Payment Method
                    </Text>
                    <Text fontSize="xs" color={styles.textSub}>
                      This will be your default payment method
                    </Text>
                  </VStack>
                </HStack>
              </Button>
            </VStack>
          </DialogBody>

          <Separator borderColor={styles.border1} />

          <DialogFooter>
            <HStack spacing={3} w="full">
              <Button
                flex={1}
                variant="outline"
                borderColor={styles.border1}
                color={styles.textMain}
                borderRadius="12px"
                onClick={() => {
                  setIsPaymentDialogOpen(false);
                  setCardNumber("");
                  setCardHolder("");
                  setExpireDate("");
                  setCvv("");
                  setIsPrimaryPayment(false);
                  setEditingPaymentId(null);
                  setPaymentErrors({
                    cardNumber: "",
                    cardHolder: "",
                    expireDate: "",
                    cvv: "",
                  });
                }}
                _hover={{ bg: styles.bgFourth }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                bg={styles.mainFixed}
                color="white"
                borderRadius="12px"
                _hover={{ bg: styles.mainFixed70a }}
                onClick={handleSavePayment}
              >
                Add Payment Method
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
