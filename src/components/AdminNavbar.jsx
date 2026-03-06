import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X, Shield, Settings } from "lucide-react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/control-panel", label: "Control", icon: <Settings size={18} /> },
    { to: "/admin/subscribers", label: "Subscribers", icon: <Users size={18} /> },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 z-[100] h-20">
        <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/admin" className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-xl shadow-lg shadow-yellow-400/20">
              <Shield size={22} className="text-black" />
            </div>
            <h1 className="text-white text-lg font-black tracking-tighter uppercase leading-none">
              ADMIN <span className="text-yellow-400">PANEL</span>
            </h1>
          </Link>

          {/* Desktop Links with Icons */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all py-2 px-3 rounded-xl ${
                  location.pathname === link.to 
                  ? 'text-yellow-400 bg-yellow-400/5' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-white transition-all flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] bg-red-500/5 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/10"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white bg-white/5 border border-white/10 rounded-xl"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR (Drawer) */}
      <div className={`fixed inset-0 z-[110] transition-all duration-300 ${isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        <div className={`absolute top-0 right-0 w-[300px] h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl transition-transform duration-500 flex flex-col p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-white">Menu</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white bg-white/5 rounded-lg border border-white/10">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 p-5 rounded-[1.5rem] transition-all border ${
                  location.pathname === link.to 
                  ? 'bg-yellow-400 border-yellow-400 text-black font-black shadow-lg shadow-yellow-400/10' 
                  : 'bg-[#111] border-white/5 text-gray-400 font-bold hover:border-white/20'
                }`}
              >
                {link.icon}
                <span className="uppercase text-[12px] tracking-widest">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[12px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={20} />
              Logout Admin
            </button>
          </div>
        </div>
      </div>

      <div className="h-20 w-full"></div>
    </>
  );
};

export default AdminNavbar;