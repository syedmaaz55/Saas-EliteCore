import React, { useEffect, useState } from "react";
import { CreditCard, History, ChevronRight, CheckCircle2, AlertCircle, Loader2, DollarSign, Calendar } from "lucide-react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FIX: Firestore Timestamp ko Date mein badalne ka logic ---
  const formatBillingDate = (data) => {
    if (data.nextBilling) return data.nextBilling; // Agar nextBilling maujood hai
    if (data.paymentDate && data.paymentDate.seconds) {
      // Agar paymentDate hai, toh usse readable banao
      const date = new Date(data.paymentDate.seconds * 1000);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    return "Pending";
  };

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!auth.currentUser) return;

      try {
        const planDoc = await getDoc(doc(db, "subscriptions", auth.currentUser.uid));

        if (planDoc.exists()) {
          setCurrentPlan(planDoc.data());
        }
      } catch (error) {
        console.error("Billing Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="text-yellow-400 animate-spin" size={40} />
    </div>
  );

  if (!currentPlan || currentPlan.status === "inactive") return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-6 text-center pt-20">
      <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl">
        <AlertCircle className="mx-auto text-yellow-400 mb-4" size={48} />
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">No Active Subscription</h2>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto text-xs uppercase font-bold tracking-widest">Upgrade now to unlock the full potential of EliteCore.</p>
        <button onClick={() => window.location.href = '/pricing'} className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-400/10">
          Unlock Access
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 md:px-12 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase leading-none">
            Billing <span className="text-yellow-400">& Invoices</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase opacity-70">Security Clearance: {currentPlan.name}</p>
        </header>

        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard size={120} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-yellow-400/10 text-yellow-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-400/20">
                  {currentPlan.name} Plan
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {currentPlan.status}
                </div>
              </div>

              <h3 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                ${currentPlan.amount}<span className="text-sm text-gray-500 tracking-normal">/mo</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Billing Date</p>
                  <p className="text-lg font-bold text-gray-200">{formatBillingDate(currentPlan)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Payment Method</p>
                  <p className="text-lg font-bold text-gray-200 uppercase">{currentPlan.paymentMethod || "Card"}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.open("https://billing.stripe.com/", "_blank")}
              className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Portal Access <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/5 rounded-2xl"><History className="text-yellow-400" size={20} /></div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Invoices History</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="pb-6 px-4">Billing Date</th>
                  <th className="pb-6 px-4">Amount</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4 text-right">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 px-4 text-sm font-bold text-gray-300">
                    {formatBillingDate(currentPlan)}
                  </td>
                  <td className="py-6 px-4 text-sm font-black text-white">
                    ${currentPlan.amount}
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-[10px] font-black uppercase text-green-500/80">
                        {currentPlan.status === "active" ? "Captured" : "Pending"}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 bg-white/5 px-3 py-1 rounded-lg uppercase tracking-widest">
                      <CreditCard size={12} /> {currentPlan.paymentMethod || "Stripe"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;