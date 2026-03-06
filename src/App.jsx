import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // ✅ onSnapshot for real-time unlock

// Components
import Navbar from "./components/Navbar";
import ProtectedFeature from "./components/ProtectedFeature"; 

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import PdfGenerator from "./pages/PdfGenerator"; 

// Admin Pages
import AdminPanel from "./pages/admin/AdminPanel";
import ControlPanel from "./pages/admin/ControlPanel";
import Subscribers from "./pages/admin/Subscribers";

function Layout({ user, subscription }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-black">
      {!isAdminPage && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard subscriptionStatus={subscription?.status} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/billing" element={user ? <Billing /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

        <Route
          path="/pdf-generator"
          element={
            <ProtectedFeature subscription={subscription}>
              <PdfGenerator />
            </ProtectedFeature>
          }
        />

        <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/admin/control-panel" element={user ? <ControlPanel /> : <Navigate to="/login" />} />
        <Route path="/admin/subscribers" element={user ? <Subscribers /> : <Navigate to="/login" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Real-time listener: Jaise hi payment success hogi, data update ho jayega
        const docRef = doc(db, "subscriptions", currentUser.uid);
        
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setSubscription(docSnap.data());
          } else {
            setSubscription(null);
          }
          setLoading(false); // Data milne par loading stop
        }, (error) => {
          console.error("Firestore Error:", error);
          setLoading(false);
        });
      } else {
        setSubscription(null);
        setLoading(false); // No user, no loading
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-xl animate-pulse font-black uppercase tracking-widest">
          Syncing Elite Access...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} subscription={subscription} />
    </Router>
  );
}

export default App;