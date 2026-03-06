// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { Menu, X, LogOut, LayoutDashboard, CreditCard, Zap, Settings, BarChart3, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // logout → Home page
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Billing', path: '/billing', icon: <CreditCard size={16} /> },
    { name: 'Profile', path: '/profile', icon: <Settings size={16} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-3 flex items-center justify-between shadow-2xl">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-yellow-400/20">
            <Zap className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            ELITE<span className="text-yellow-400 font-extrabold">CORE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/pricing" className="text-gray-400 hover:text-yellow-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-colors">
            <Zap size={14} /> Pricing
          </Link>

          {user ? (
            <>
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-gray-400 hover:text-yellow-400 text-[10px] tracking-[0.2em] font-black transition-colors flex items-center gap-2 uppercase">
                  {link.icon} {link.name}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 cursor-pointer uppercase"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white text-[10px] font-black tracking-widest uppercase transition-colors">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-black px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest hover:scale-105 transition-transform shadow-lg shadow-yellow-400/20 uppercase">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl"
          >
            <Link to="/pricing" className="text-white text-xl font-black uppercase tracking-widest flex items-center gap-4" onClick={() => setIsOpen(false)}>
              <Zap size={24} className="text-yellow-400" /> Pricing
            </Link>

            {user ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <UserCircle className="text-yellow-400" size={40} />
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wider">{user.email?.split('@')[0]}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Active Member</p>
                  </div>
                </div>

                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="text-white text-xl font-black uppercase tracking-widest flex items-center gap-4 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    {link.icon} {link.name}
                  </Link>
                ))}

                <button onClick={handleLogout} className="mt-4 text-red-500 text-left text-xl font-black uppercase tracking-widest flex items-center gap-4">
                  <LogOut size={24} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white text-2xl font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="bg-yellow-400 text-black text-center py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl" onClick={() => setIsOpen(false)}>Register Now</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;