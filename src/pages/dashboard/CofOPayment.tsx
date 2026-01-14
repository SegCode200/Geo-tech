import React from "react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate, useLocation } from "react-router-dom";

const COFOPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get amount & user details from application (passed as state)
  const { amount, email, applicationId } = location.state || {};

  // Paystack Configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: email || "user@example.com",
    amount: amount * 100, // Convert to kobo
    publicKey: "pk_live_9ad87f9c47ee31a9ef92a72e7c1b5387a1f6fc48", // Replace with your actual Paystack public key
  };

  const onSuccess = (reference:any) => {
    console.log("Payment Successful", reference);

    // Redirect to application list after payment
    navigate("/dashboard/c-of-o-list", { state: { message: "Payment successful! Your application is now processing." } });
  };

  const onClose = () => {
    console.log("Payment Window Closed");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Make Payment for C of O</h1>

      <p className="text-gray-600 mb-4">Amount to Pay: <span className="font-bold">₦{amount}</span></p>

      <button
        onClick={() => initializePayment({ onSuccess, onClose })}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
      >
        Pay with Paystack
      </button>
    </div>
  );
};

export default COFOPayment;
