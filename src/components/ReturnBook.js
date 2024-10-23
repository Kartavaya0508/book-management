import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const ReturnBook = ({ userId }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Fetch borrowed books for the user
  const fetchBorrowedBooks = async () => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setBorrowedBooks(userData.borrowedBooks || []);
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  // Return a book
  const handleReturnBook = async (bookId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const bookDocRef = doc(db, 'books', bookId);

      // Update the user's document by removing the book from borrowedBooks
      await updateDoc(userDocRef, {
        borrowedBooks: arrayRemove({ id: bookId }) // Ensure the format matches what you added
      });

      // Update the book's availability
      await updateDoc(bookDocRef, {
        available: true // Mark the book as available
      });

      alert('Book returned successfully!');
      fetchBorrowedBooks(); // Refresh the list after returning the book
    } catch (error) {
      console.error("Error returning the book:", error);
      alert("Failed to return the book. Please try again.");
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div>
      <h2>Your Borrowed Books</h2>
      <ul>
        {borrowedBooks.length > 0 ? (
          borrowedBooks.map((book) => (
            <li key={book.id}>
              <p><strong>Title:</strong> {book.title}</p>
              <button onClick={() => handleReturnBook(book.id)}>Return</button>
            </li>
          ))
        ) : (
          <p>No borrowed books found.</p>
        )}
      </ul>
    </div>
  );
};

export default ReturnBook;
