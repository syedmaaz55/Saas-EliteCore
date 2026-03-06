import React from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, FileText, LayoutDashboard, CreditCard, ChevronRight, Star, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden font-sans relative">
      
      {/* --- ELITE RADIAL GLOWS (Background) --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] left-[10%] w-[400px] h-[400px] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Next Gen Subscription Engine</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-8">
            SCALE YOUR <br />
            <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.2)]">SAAS EMPIRE</span>
          </h1>

          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-12">
            Automate your billing with Stripe, secure your data with Firebase, and provide elite tools like 
            <span className="text-white font-bold"> PDF Generation</span> and <span className="text-white font-bold"> Real-time Analytics</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link
              to="/register"
              className="group relative px-10 py-5 bg-yellow-400 text-black font-black tracking-widest text-[10px] uppercase rounded-2xl hover:bg-white transition-all shadow-2xl shadow-yellow-400/20 flex items-center gap-3"
            >
              Start Building Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/pricing"
              className="px-10 py-5 border border-white/10 text-white font-black tracking-widest text-[10px] uppercase rounded-2xl hover:bg-white/5 transition-all backdrop-blur-md"
            >
              Explore Plans
            </Link>
          </div>
        </div>
      </section>

      {/* --- ROADMAP / FEATURES SECTION --- */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                BUILT FOR <span className="text-yellow-400">PERFORMANCE</span>
              </h2>
              <p className="text-gray-500 font-medium">Professional infrastructure for modern SaaS startups.</p>
            </div>
            <div className="h-[1px] flex-grow bg-white/10 hidden md:block mb-6 ml-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cards use glassmorphism to show the radial glow through them */}
            {[
              { 
                icon: <CreditCard className="text-yellow-400" size={28} />, 
                title: "Seamless Billing", 
                desc: "Integrated Stripe Checkout and Customer Portals. Handle subscriptions and invoices with ease." 
              },
              { 
                icon: <FileText className="text-yellow-400" size={28} />, 
                title: "Premium Tools", 
                desc: "Exclusive features like PDF Generator and Advanced Exports, secured via active plan middleware." 
              },
              { 
                icon: <LayoutDashboard className="text-yellow-400" size={28} />, 
                title: "Admin Insights", 
                desc: "Full-scale management UI to track subscribers, user roles, and monitor growth in real-time." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-yellow-400/30 transition-all duration-500 backdrop-blur-xl">
                <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-8 border border-yellow-400/20 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="px-6 py-24 bg-white/[0.01] border-y border-white/5 relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Active Users", val: "10K+" },
            { label: "Security", val: "AES-256" },
            { label: "Uptime", val: "99.9%" },
            { label: "Support", val: "24/7" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{stat.val}</p>
              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="px-6 py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3.5rem] bg-gradient-to-br from-yellow-400 to-yellow-600 text-black relative overflow-hidden shadow-2xl shadow-yellow-400/20">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none relative z-10">
            Ready to <br /> Launch?
          </h3>
          <p className="text-black/70 max-w-md mx-auto font-bold text-sm mb-10 relative z-10">
            Day 1 setup complete. Day 2 billing ready. Join the elite circle of SaaS builders today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-12 py-5 bg-black text-white font-black tracking-widest text-[10px] uppercase rounded-2xl hover:scale-105 transition-all relative z-10 shadow-2xl"
          >
            Get Unlimited Access <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-white/5 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
          Powered by <span className="text-yellow-400">EliteSaaS Framework</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;