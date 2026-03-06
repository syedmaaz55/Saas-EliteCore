import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, UserPlus, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [isLengthValid, setIsLengthValid] = useState(false);
    const [isMatch, setIsMatch] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLengthValid(password.length >= 6);
        setIsMatch(password !== '' && password === confirmPassword);
    }, [password, confirmPassword]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isLengthValid || !isMatch || loading) return;

        setLoading(true);
        setErrorMsg('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                subscriptionStatus: "inactive",
                role: "user",
                createdAt: serverTimestamp()
            });

            await setDoc(doc(db, "subscriptions", user.uid), {
                status: "inactive",
                name: "None",
                amount: 0,
                email: user.email,
                createdAt: serverTimestamp()
            });

            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                navigate('/pricing'); 
            }, 1500);

        } catch (error) {
            setLoading(false);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErrorMsg("EMAIL ALREADY TAKEN! TRY LOGGING IN.");
                    break;
                case 'auth/invalid-email':
                    setErrorMsg("INVALID EMAIL FORMAT!");
                    break;
                default:
                    setErrorMsg("SOMETHING WENT WRONG. TRY AGAIN.");
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] px-4 font-sans pt-32 pb-12">
            
            {/* --- ELITE SIDE GLOWS --- */}
            <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black">
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-400/5 transition-transform hover:-rotate-6">
                            <UserPlus className="text-yellow-400 w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase text-white">
                            Join the <span className="text-yellow-400">Elite</span>
                        </h2>
                        <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.2em]">Create your golden tier account</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                            <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-none">{errorMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black ml-1">Identity (Email)</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all text-sm text-white placeholder-gray-700 font-medium"
                                    placeholder="ceo@company.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">Security Key</label>
                                {password.length > 0 && (
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isLengthValid ? 'text-green-500' : 'text-red-500'}`}>
                                        {isLengthValid ? 'SECURE' : '6+ CHARS REQ'}
                                    </span>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${password.length > 0 ? (isLengthValid ? 'text-green-500' : 'text-red-500') : 'text-gray-600'}`} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all text-sm text-white placeholder-gray-700 font-medium"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {password.length > 0 && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        {isLengthValid ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">Verify Key</label>
                                {confirmPassword.length > 0 && (
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isMatch ? 'text-green-500' : 'text-red-500'}`}>
                                        {isMatch ? 'VERIFIED' : 'MISMATCH'}
                                    </span>
                                )}
                            </div>
                            <div className="relative group">
                                <ShieldCheck className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${confirmPassword.length > 0 ? (isMatch ? 'text-green-500' : 'text-red-500') : 'text-gray-600'}`} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all text-sm text-white placeholder-gray-700 font-medium"
                                    placeholder="••••••••"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword.length > 0 && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        {isMatch ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isLengthValid || !isMatch || success}
                            className={`group w-full py-5 mt-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase text-[12px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 
                  ${success
                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                    : 'bg-yellow-400 text-black hover:bg-white shadow-yellow-400/20 disabled:opacity-30'}`}
                        >
                            {loading ? (success ? "SUCCESS! REDIRECTING..." : "CREATING...") : (
                                <>
                                    Create Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            Existing Member? <Link to="/login" className="text-white hover:text-yellow-400 transition-colors underline underline-offset-4 ml-1">Secure Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;