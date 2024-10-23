// src/components/BorrowBook.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';

const BorrowBook = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const booksCol = collection(db, 'books');
      const booksSnapshot = await getDocs(booksCol);
      const bookList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(bookList.filter(book => book.available)); // Only show available books
    };

    fetchBooks();
  }, []);

  const handleBorrowBook = async (e) => {
    e.preventDefault();

    // Check if user already has a borrowed book
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
console.log(userData)
    if (userData && userData.bookHistory.some(book => book.returnDate === null)) {
      alert("You can only borrow one book at a time!");
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const bookRef = doc(db, 'books', selectedBook);

    try {
      // Update book availability
      await updateDoc(bookRef, {
        available: false
      });

      // Update user book history
      await updateDoc(userRef, {
        bookHistory: arrayUnion({
          title: books.find(book => book.id === selectedBook).title,
          author: books.find(book => book.id === selectedBook).author,
          issueDate: currentDate,
          returnDate: null
        })
      });

      alert("Book borrowed successfully!");
      setSelectedBook('');
    } catch (error) {
      console.error("Error borrowing book: ", error);
    }
  };

  return (
    <form onSubmit={handleBorrowBook}>
      <h2>Borrow Book</h2>
      <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required>
        <option value="" disabled>Select a Book</option>
        {books.map(book => (
          <option key={book.id} value={book.id}>
            {book.title} by {book.author}
          </option>
        ))}
      </select>
      <button type="submit">Borrow</button>
    </form>
  );
};

export default BorrowBook;