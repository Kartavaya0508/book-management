import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, 'books');
      const bookData = await getDocs(booksCollection);
      setBooks(bookData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Available Books</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;