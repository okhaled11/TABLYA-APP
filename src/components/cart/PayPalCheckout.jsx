import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { toaster } from "../ui/toaster";

const PayPalCheckout = ({ amount = "10.00", onSuccess }) => {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AZQOHpDADDWY8hQuZ0GRiYk7SvyZ_5Y_ci57ObQdwJZNRtEZjkb_gCaZA1t6co8YjFCzk_ZV-8TSG3S2",
        currency: "EUR",
      }}
    >
      <div style={{ maxWidth: "400px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Pay with PayPal</h2>

        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "pill", label: "paypal" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: "Test Payment",
                  amount: {
                    currency_code: "EUR",
                    value: amount,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            setPaid(true);
            if (onSuccess) onSuccess(details);
            toaster.create({
              title: "Payment successful",
              description: `Paid ${amount} EUR via PayPal`,
              type: "success",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }}
          onError={(err) => {
            setError(err);
            toaster.create({
              title: "PayPal error",
              description: err?.message || "Something went wrong.",
              type: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }}
        />

        {paid && <p style={{ color: "green", textAlign: "center" }}>✅ Payment successful!</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>❌ Something went wrong.</p>}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
