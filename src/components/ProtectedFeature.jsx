import React from "react";
import { Lock } from "lucide-react";

const ProtectedFeature = ({ subscription, children }) => {
  // Console mein data check karne ke liye
  console.log("ProtectedFeature - Subscription Data:", subscription);

  // Agar status 'active' hai toh feature dikhao
  const isActive = subscription?.status === "active";

  if (!isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Lock className="w-10 h-10 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
        <p className="text-gray-400">
          Upgrade your plan to unlock this feature
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedFeature;