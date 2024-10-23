import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersData = await getDocs(usersCollection);
      setUsers(usersData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;