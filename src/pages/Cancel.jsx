import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 text-yellow-400">
      <h1 className="text-5xl font-bold mb-4">❌ Payment Cancelled</h1>
      <p className="text-lg mb-6">
        Your payment was not completed. You can try again or contact support if needed.
      </p>
      <Link
        to="/pricing"
        className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Cancel;