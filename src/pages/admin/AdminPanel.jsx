import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Users, UserCheck, UserMinus, Loader2, Shield } from "lucide-react";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // 1. Check Admin Status (Email se check karein)
        const usersRef = collection(db, "users");
        const adminQuery = query(usersRef, where("email", "==", currentUser.email), where("role", "==", "admin"));
        const adminSnap = await getDocs(adminQuery);

        if (!adminSnap.empty) {
          setIsAdmin(true);
        } else {
          setLoading(false);
          return;
        }

        // 2. Fetch All Data
        const allUsersSnap = await getDocs(collection(db, "users"));
        const allSubsSnap = await getDocs(collection(db, "subscriptions"));

        // Subscriptions ko Map mein convert karein (UID key hogi)
        const subsMap = {};
        allSubsSnap.docs.forEach(d => {
          subsMap[d.id] = d.data(); // Document ID hi User UID hai
        });

        // 3. Merge Users with Subscriptions
        const combinedData = allUsersSnap.docs.map(uDoc => {
          const uData = uDoc.data();
          const uid = uData.uid || uDoc.id; // User ki UID
          const subData = subsMap[uid] || {}; // Subscription match karein

          return {
            id: uDoc.id,
            email: uData.email || "No Email",
            plan: subData.name || "Free",
            status: subData.status === "active" ? "Paid" : "Unpaid",
            joinDate: uData.createdAt ? new Date(uData.createdAt.seconds * 1000).toLocaleDateString() : "New User"
          };
        });

        setUsersList(combinedData);
      } catch (error) {
        console.error("AdminPanel Fetch Error:", error);
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

  const total = usersList.length;
  const paid = usersList.filter(u => u.status === "Paid").length;
  const unpaid = total - paid;

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-black pt-28 px-6 text-white font-sans">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">
            System <span className="text-yellow-400">Overview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/10">
              <Users className="text-blue-400 mb-4" size={24} />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Users</p>
              <p className="text-4xl font-black mt-1">{total}</p>
            </div>
            <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 border-green-500/20">
              <UserCheck className="text-green-400 mb-4" size={24} />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Subs</p>
              <p className="text-4xl font-black mt-1 text-green-500">{paid}</p>
            </div>
            <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 border-red-500/20">
              <UserMinus className="text-red-400 mb-4" size={24} />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Unpaid</p>
              <p className="text-4xl font-black mt-1 text-red-500">{unpaid}</p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-black text-gray-500 tracking-widest">
                  <th className="p-6">User Email</th>
                  <th className="p-6">Plan</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-6 font-bold">{user.email}</td>
                    <td className="p-6">
                      <span className="bg-white/5 px-3 py-1 rounded-lg text-xs font-bold text-gray-400">
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase ${
                        user.status === "Paid" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-6 text-right text-gray-500 text-sm font-medium">{user.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;