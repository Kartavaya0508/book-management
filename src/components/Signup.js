import React, { useState } from 'react';
import { auth, db } from '../firebase-config'; // Ensure db is imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css'; // Corrected import path

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is user
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user's email and initialize borrowedBooks in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        borrowedBooks: [] // Initialize borrowedBooks as an empty array
      });

      alert('Signup successful!');
      navigate('/login'); // Redirect to login after signup
    } catch (error) {
      console.error("Signup failed", error);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h1>Library Management System</h1>
      <form onSubmit={handleSignup}>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{role === 'user' ? 'Signup' : 'Login as Admin'}</button>
      </form>
    </div>
  );
};

export default Signup;
