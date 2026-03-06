import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-sans relative overflow-hidden">
      
      {/* --- ELITE SIDE GLOWS --- */}
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-yellow-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-yellow-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-yellow-400/10 border border-yellow-400/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-400/5 animate-bounce">
          <AlertTriangle className="text-yellow-400 w-12 h-12" />
        </div>

        {/* Error Code BG */}
        <h1 className="text-[120px] md:text-[180px] font-black tracking-tighter leading-none text-white opacity-10 absolute left-1/2 -translate-x-1/2 top-[-40px] select-none z-[-1]">
          404
        </h1>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white mb-6">
          LOST IN <span className="text-yellow-400">SPACE?</span>
        </h2>
        
        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-12 leading-relaxed max-w-md mx-auto">
          The restricted area you are looking for does not exist or has been moved to a higher security tier.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-3 bg-yellow-400 text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-400/20 active:scale-95"
          >
            <Home size={16} /> Return to Base
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all backdrop-blur-md"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Branding Footer */}
        <p className="mt-20 text-[9px] font-black uppercase tracking-[0.6em] text-gray-700">
          Error Log: <span className="text-gray-500">Resource_Not_Found</span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;