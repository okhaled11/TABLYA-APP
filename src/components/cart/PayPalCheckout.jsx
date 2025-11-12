import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toaster } from "../ui/toaster";

// 🔹 المفتاح العام (Publishable key) من Stripe Dashboard
const stripePromise = loadStripe(
  "pk_test_51SRwXWFuoYhjngjb990Ud3vwROMKrzXlAP7xeP0xKWfzTCgbY1lHiTsOoa7OisIMHvx9bJztylXNaxydC3jxOqg700fB5OUq0F"
);

// 🔹 لينك Edge Function في Supabase
const FN_URL =
  "https://hzqeraiapeyyerkvdiod.supabase.co/functions/v1/create_payment_intent";

const CheckoutForm = ({ amount, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // 1️⃣ نجيب clientSecret من Supabase Edge Function
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount), // المبلغ كرقم
          currency: "eur",
          metadata: orderId ? { orderId } : undefined,
        }),
      });

      const { clientSecret, error } = await res.json();
      if (!res.ok || error)
        throw new Error(error || "Failed to create payment intent");

      // 2️⃣ نأكد الدفع باستخدام Stripe
      const { error: confirmErr, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

      if (confirmErr) {
        toaster.create({
          title: "Payment failed",
          description: confirmErr.message,
          type: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setProcessing(false);
        return;
      }

      // 3️⃣ لو الدفع نجح
      if (paymentIntent?.status === "succeeded") {
        setPaid(true);

        onSuccess?.({
          stripe_payment_id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          orderId,
        });

        toaster.create({
          title: "Payment successful",
          description: `Paid ${amount} EUR via Stripe`,
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toaster.create({
          title: "Payment status",
          description: paymentIntent?.status || "unknown",
          type: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Pay with Stripe
      </h2>

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
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
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
        {paid
          ? "✅ Payment Successful"
          : processing
          ? "Processing..."
          : `Pay ${amount} EUR`}
      </button>

      {paid && (
        <p
          style={{
            color: "green",
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          ✅ Payment completed successfully!
        </p>
      )}
    </form>
  );
};

const PayPalCheckout = ({ amount = "10.00", orderId = null, onSuccess }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} orderId={orderId} onSuccess={onSuccess} />
  </Elements>
);

export default PayPalCheckout;
