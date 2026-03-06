import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // ✅ Real-time data ke liye
import { User, Mail, CreditCard, ShieldCheck, LogOut, Loader2 } from "lucide-react";

const Profile = () => {
  const [userAuth, setUserAuth] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserAuth(currentUser);

        // ✅ Firestore se dynamic subscription data uthao
        const subRef = doc(db, "subscriptions", currentUser.uid);
        const unsubscribeDoc = onSnapshot(subRef, (docSnap) => {
          if (docSnap.exists()) {
            setSubscription(docSnap.data());
          } else {
            setSubscription({ name: "Free", status: "Inactive" });
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-yellow-400 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none"></div>

      <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter italic uppercase">
        MY <span className="text-yellow-400">PROFILE</span>
      </h1>

      <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-md relative z-10">
        <div className="space-y-6">
          {/* Name Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl">
              <User className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Full Name</p>
              <p className="text-lg font-bold">
                {userAuth?.displayName || userAuth?.email?.split('@')[0] || "User"}
              </p>
            </div>
          </div>

          {/* Email Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl">
              <Mail className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Email Address</p>
              <p className="text-lg font-bold text-gray-300">{userAuth?.email}</p>
            </div>
          </div>

          <hr className="border-white/5 my-2" />

          {/* Plan Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl">
              <CreditCard className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Current Plan</p>
              <p className="text-lg font-bold text-yellow-400 uppercase italic">{subscription?.name || "Starter"}</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl">
              <ShieldCheck className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Subscription Status</p>
              <p className={`text-lg font-bold ${subscription?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                {subscription?.status?.toUpperCase() || "INACTIVE"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-10 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 border border-white/10 hover:border-red-500/50 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default Profile;