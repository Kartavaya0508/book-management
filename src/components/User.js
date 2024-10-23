import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const User = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const bookCollection = await getDocs(collection(db, 'books'));
      setBooks(bookCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>Available Books</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;