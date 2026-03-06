import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Trash2, Shield, User, Star, Loader2 } from "lucide-react";

const ControlPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return setLoading(false);

      try {
        // 1. Precise Admin Check
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const adminSnap = await getDocs(q);
        if (!adminSnap.empty && adminSnap.docs[0].data().role === "admin") {
          setIsAdmin(true);
        }

        // 2. Fetch Users & Subscriptions Parallelly
        const [usersSnap, subsSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "subscriptions"))
        ]);

        const subsMap = {};
        subsSnap.docs.forEach(d => subsMap[d.id] = d.data());

        // 3. Dynamic Merge
        const allUsers = usersSnap.docs.map(uDoc => {
          const uData = uDoc.data();
          const uid = uData.uid || uDoc.id;
          const sData = subsMap[uid] || {};
          
          return {
            id: uDoc.id,
            email: uData.email,
            role: uData.role || "user",
            plan: sData.name || "Free",
            status: sData.status || "inactive"
          };
        });

        setUsers(allUsers);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, are you sure? Ye user hamesha ke liye delete ho jayega!")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("Delete failed!");
    }
  };

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
        {/* Background Decorative Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                Control <span className="text-yellow-400">Hub</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Manage permissions and user access</p>
            </div>
            <div className="hidden md:block bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <span className="text-gray-400 text-xs uppercase font-bold">Total Directory: </span>
              <span className="text-yellow-400 font-black ml-2">{users.length}</span>
            </div>
          </header>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                  <tr>
                    <th className="p-8">User Identity</th>
                    <th className="p-8">Access Level</th>
                    <th className="p-8">Current Tier</th>
                    <th className="p-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.03] transition-all group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-black text-xs">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-200">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          {user.role === "admin" ? (
                            <Shield size={14} className="text-yellow-400" />
                          ) : (
                            <User size={14} className="text-gray-500" />
                          )}
                          <span className={`text-xs font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-yellow-400' : 'text-gray-500'}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          <Star size={14} className={user.plan !== 'Free' ? 'text-green-400' : 'text-gray-600'} />
                          <span className="text-xs font-bold text-gray-300">{user.plan}</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 shadow-lg shadow-red-500/5 group-hover:scale-110"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;