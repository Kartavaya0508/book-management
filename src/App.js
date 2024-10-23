import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import Admin from './components/Admin';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [currentUser, setCurrentUser] = React.useState(null);

  // Listen for auth state changes (if the user is logged in or not)
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  // Protect the dashboard routes so only authenticated users can access them
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Default route redirects to login if not authenticated */}
        <Route path="/" element={<Navigate to={currentUser ? "/user-dashboard" : "/login"} />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Signup route */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected user dashboard route */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected admin dashboard route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
