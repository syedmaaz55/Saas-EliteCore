import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Crown, Calendar, CreditCard, Hash, Activity, Loader2 } from "lucide-react";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return setLoading(false);

      try {
        // 1. Precise Admin Check (Using Email Query)
        const qAdmin = query(collection(db, "users"), where("email", "==", currentUser.email));
        const adminSnap = await getDocs(qAdmin);
        if (!adminSnap.empty && adminSnap.docs[0].data().role === "admin") {
          setIsAdmin(true);
        }

        // 2. Fetch Subscriptions & Users for Email Mapping
        const [snapshotSubs, snapshotUsers] = await Promise.all([
          getDocs(collection(db, "subscriptions")),
          getDocs(collection(db, "users"))
        ]);

        // Map UID to Email
        const userMap = {};
        snapshotUsers.docs.forEach(doc => {
          const data = doc.data();
          userMap[data.uid || doc.id] = data.email;
        });

        const subsList = snapshotSubs.docs.map(doc => {
          const data = doc.data();
          const uid = doc.id;
          return {
            id: uid,
            email: data.email || userMap[uid] || "Unknown User", // ✅ Ab Email nazar aayega
            ...data
          };
        });

        setSubscribers(subsList);
      } catch (error) {
        console.error("Subscribers Fetch Error:", error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="text-yellow-400 animate-spin" size={40} />
    </div>
  );

  if (!isAdmin) return <Navigate to="/dashboard" />;

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-black pt-28 px-6 md:px-12 text-white relative overflow-hidden">
        {/* Neon Glow Effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-400/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Premium <span className="text-yellow-400">Members</span>
            </h2>
            <p className="text-gray-500 text-xs font-black tracking-[0.4em] uppercase mt-2 opacity-70">
              Real-time subscription management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] flex items-center gap-4">
              <div className="bg-yellow-400/10 p-4 rounded-2xl"><Crown className="text-yellow-400" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Plans</p>
                <p className="text-2xl font-black">{subscribers.length}</p>
              </div>
            </div>
            {/* Add more mini-stats here if needed */}
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                  <tr>
                    <th className="p-8">Subscriber</th>
                    <th className="p-8">Plan Detail</th>
                    <th className="p-8">Status</th>
                    <th className="p-8">Billing Cycle</th>
                    <th className="p-8 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-20 text-center text-yellow-400/50 font-black uppercase tracking-widest italic">
                        No active subscriptions found
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.03] transition-all group">
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-200">{sub.email}</span>
                            <span className="text-[10px] text-gray-600 font-mono mt-1">{sub.id}</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center gap-2">
                            <StarIcon className="text-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-yellow-400/80">
                              {sub.name || 'Pro'}
                            </span>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase text-green-500 tracking-tighter">
                              {sub.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={12} />
                            <span className="text-xs font-medium italic">{sub.nextBilling || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <span className="text-xl font-black text-white tracking-tighter">
                            ${sub.amount || '0'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StarIcon = ({ className }) => (
  <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default Subscribers;