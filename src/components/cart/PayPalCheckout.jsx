import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toaster } from "../ui/toaster";

// TODO: Replace with your Stripe publishable key
// Get from: https://dashboard.stripe.com/test/apikeys
const stripePromise = loadStripe("pk_test_51SRwXWFuoYhjngjb990Ud3vwROMKrzXlAP7xeP0xKWfzTCgbY1lHiTsOoa7OisIMHvx9bJztylXNaxydC3jxOqg700fB5OUq0F");

const CheckoutForm = ({ amount, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // TODO: Create payment intent on your backend
      // For now, using test mode
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error("Stripe error:", error);
        toaster.create({
          title: "Payment failed",
          description: error.message,
          type: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setProcessing(false);
        return;
      }

      console.log("Payment method created:", paymentMethod);
      setPaid(true);

      // Pass payment details to parent
      if (onSuccess) {
        onSuccess({
          stripe_payment_id: paymentMethod.id,
          payment_method: paymentMethod.type,
          status: "succeeded",
          amount: amount,
          currency: "eur",
        });
      }

      toaster.create({
        title: "Payment successful",
        description: `Paid ${amount} EUR via Stripe`,
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.error("Payment error:", err);
      toaster.create({
        title: "Payment failed",
        description: err?.message || "Something went wrong",
        type: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Pay with Stripe</h2>

      {/* Testing instructions */}
      {/* <div
        style={{
          backgroundColor: "#e3f2fd",
          border: "1px solid #2196f3",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#1565c0",
        }}
      >
        <strong>💳 Test Cards:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>Success: 4242 4242 4242 4242</li>
          <li>Any future expiry date (MM/YY)</li>
          <li>Any 3-digit CVC</li>
        </ul>
      </div> */}

      {/* Card Element */}
      <div
        style={{
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "white",
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {/* Payment Button */}
      <button
        type="submit"
        disabled={!stripe || processing || paid}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: paid ? "#4caf50" : processing ? "#999" : "#635bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: !stripe || processing || paid ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {paid ? "✅ Payment Successful" : processing ? "Processing..." : `Pay ${amount} EUR`}
      </button>

      {paid && (
        <p style={{ color: "green", textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
          ✅ Payment completed successfully!
        </p>
      )}
    </form>
  );
};

const StripeCheckout = ({ amount = "10.00", orderId = null, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeCheckout;