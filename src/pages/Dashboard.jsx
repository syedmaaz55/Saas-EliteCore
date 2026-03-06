import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { FileText, Lock, CreditCard, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

// Is code mein koi tabdeeli nahi hai, ye pehle se hi dynamic hai
useEffect(() => {
  if (!auth.currentUser) return;

  // Har user ka apna document fetch hoga
  const unsub = onSnapshot(doc(db, "subscriptions", auth.currentUser.uid), (docSnap) => {
    if (docSnap.exists()) {
      setSubscription(docSnap.data());
    } else {
      setSubscription({ status: "inactive" });
    }
    setLoading(false);
  });

  return () => unsub();
}, []);

  const isSubscribed = subscription?.status?.toLowerCase() === "active";

  const handleManageBilling = async () => {
    // 3. Dynamic ID: Jo user login hoga, ye uski stripeCustomerId uthaye ga
    if (!subscription?.stripeCustomerId) {
      alert("Billing details not found. Please wait or make a fresh payment.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/demo-no-project/us-central1/createPortalSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId }), 
      });

      const data = await response.json();
      // 4. Redirect to Stripe Portal for Invoices
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Portal Error:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <Loader2 className="text-yellow-400 animate-spin" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-20 px-6 md:px-12 text-white relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-400/[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-yellow-400"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-400/80">Control Center</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            WELCOME, <span className="text-yellow-400">CHAMP</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-lg text-sm font-medium leading-relaxed">
            Manage your tools and billing preferences from your personalized executive dashboard.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TOOL CARD */}
          <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-10 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]">
            {!isSubscribed && (
              <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
                  <Lock className="text-yellow-400" size={24} />
                </div>
                <h4 className="text-xl font-black uppercase mb-2 tracking-tight">Access Restricted</h4>
                <button onClick={() => navigate('/pricing')} className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Upgrade Membership
                </button>
              </div>
            )}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-400/5 border border-yellow-400/10 rounded-[1.25rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <FileText className="text-yellow-400" size={30} />
              </div>
              <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter">PDF <span className="text-yellow-400">Gen</span></h3>
              <button onClick={() => navigate("/pdf-generator")} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all">
                Launch Tool <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* BILLING CARD */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-10 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center">
                <CreditCard className="text-gray-400" size={30} />
              </div>
              <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSubscribed ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                {isSubscribed ? 'Verified Member' : 'Inactive Account'}
              </div>
            </div>

            <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">Account <span className="text-gray-500">Billing</span></h3>

            <div className="mt-auto space-y-6">
              <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Tier</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    {subscription?.name || "Standard Access"} 
                    {isSubscribed && <Sparkles size={16} className="text-yellow-400" />}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate("/billing")} className="bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  History
                </button>
                {isSubscribed && (
                  <button onClick={handleManageBilling} className="bg-white text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all">
                    Stripe Portal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;