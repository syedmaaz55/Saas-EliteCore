import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const finalizeSubscription = async (user) => {
      // ✅ In dono ka naam niche setDoc se match hona chahiye
      const pName = searchParams.get("plan") || "Premium Plan"; 
      const pAmount = searchParams.get("amount") || "0";

      try {
        const subRef = doc(db, "subscriptions", user.uid); 
        await setDoc(subRef, {
          name: pName,
          amount: pAmount,
          status: "active",
          email: user.email,
          userId: user.uid,
          paymentDate: serverTimestamp(),
        }, { merge: true });

        // ✅ 2 second ka wait taake data sync ho jaye
        setTimeout(() => setStatus("success"), 2000);
      } catch (err) {
        console.error("Firestore Error:", err);
        setStatus("error");
      }
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        finalizeSubscription(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsub();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
      {status === "processing" ? (
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Syncing Your Access...</h2>
        </div>
      ) : (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-6xl font-black text-yellow-400 mb-4 tracking-tighter uppercase">PAID!</h1>
          <p className="text-gray-400 mb-10 uppercase tracking-widest text-xs">Your dashboard features are now unlocked.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-yellow-400 text-black font-black px-12 py-5 rounded-2xl hover:bg-white transition-all transform active:scale-95 shadow-[0_10px_30px_rgba(250,204,21,0.2)]"
          >
            GO TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;