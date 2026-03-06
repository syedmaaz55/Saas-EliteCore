import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("USER RECORD NOT FOUND IN DATABASE.");
      }
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("NO ACCOUNT FOUND WITH THIS EMAIL.");
          break;
        case "auth/wrong-password":
          setError("INCORRECT PASSWORD.");
          break;
        default:
          setError("LOGIN FAILED. PLEASE TRY AGAIN.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Maine yahan pt-32 add kiya hai taake Navbar ke niche space ban jaye
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-sans relative overflow-hidden pt-32 pb-12">
      
      {/* Side Glows - Exactly as requested */}
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogIn className="text-yellow-400 w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white">
              System <span className="text-yellow-400">Access</span>
            </h2>
            <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.2em]">Authorize your elite session</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-white placeholder-gray-700 transition-all font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Security Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-white placeholder-gray-700 transition-all font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-5 mt-4 bg-yellow-400 text-black rounded-[1.5rem] hover:bg-white transition-all duration-500 font-black uppercase text-[12px] tracking-widest shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? 'Validating...' : (
                <>
                  Enter Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              New to the system? <Link to="/register" className="text-white hover:text-yellow-400 transition-colors underline underline-offset-4 ml-1">Create Identity</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;