import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Rocket, Loader2, FileText, BarChart3, Download } from 'lucide-react';

const Pricing = () => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_STARTER, // Ab ye .env se uthayega      name: 'Starter',
      price: '19',
      features: ['PDF Generator', 'Basic Reports'], // Only Roadmap features
      highlight: false,
      icon: <Rocket className="w-8 h-8 text-yellow-400" />
    },
    {
      id: 'pro',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_PRO,
      name: 'Professional',
      price: '49',
      features: ['PDF Generator', 'Advanced Reports', 'Data Exports'], // Only Roadmap features
      highlight: true,
      icon: <Zap className="w-8 h-8 text-yellow-400" />
    },
    {
      id: 'enterprise',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ID_ENTERPRISE,
      name: 'Enterprise',
      price: '99',
      features: ['PDF Generator', 'Custom Reports', 'Unlimited Exports'], // Only Roadmap features
      highlight: false,
      icon: <Crown className="w-8 h-8 text-yellow-400" />
    },
  ];

  const handleCheckout = async (priceId, planName, planPrice) => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/demo-no-project/us-central1/createCheckoutSession",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            userId: user.uid,
            email: user.email,
            planName: planName,
            planPrice: planPrice,
            client_reference_id: user.uid
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong");
        setLoading(null);
      }
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-32 px-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white uppercase leading-none">
          CHOOSE YOUR <span className="text-yellow-400">PLAN</span>
        </h1>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`group relative p-[1px] rounded-[3rem] transition-all duration-500 ${plan.highlight ? 'bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.1)]' : 'bg-white/10 hover:bg-yellow-400/30'}`}
          >
            <div className="h-full bg-[#080808] p-10 md:p-12 rounded-[3rem] backdrop-blur-3xl flex flex-col">

              <div className="mb-10">
                <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {plan.icon}
                </div>
                <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-6xl font-black text-white tracking-tighter">${plan.price}</span>
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">/mo</span>
                </div>
              </div>

              <div className="space-y-6 mb-12 flex-grow">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                      <Check className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-tight">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleCheckout(plan.priceId, plan.name, plan.price)}
                disabled={loading === plan.name}
                className={`w-full py-6 rounded-2xl font-black tracking-[0.2em] text-[10px] uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${plan.highlight
                    ? 'bg-yellow-400 text-black hover:bg-white'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-yellow-400 hover:text-black'
                  }`}
              >
                {loading === plan.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : `ACTIVATE ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;



