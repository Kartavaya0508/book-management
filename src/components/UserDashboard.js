import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const UserDashboard = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchBorrowedBooks(user.uid);
      } else {
        setCurrentUser(null);
        setBorrowedBooks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch available books from the Firestore database
  const fetchAvailableBooks = async () => {
    try {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      const availableBooksList = booksSnapshot.docs.filter(doc => doc.data().available).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableBooks(availableBooksList);
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
  };

  // Fetch borrowed books for the current user
  const fetchBorrowedBooks = async (userId) => {
    try {
      const borrowedBooksSnapshot = await getDocs(collection(db, `users/${userId}/borrowedBooks`));
      const borrowedBooksList = borrowedBooksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBorrowedBooks(borrowedBooksList);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  };

  // Borrow a book
  const handleBorrowBook = async (bookId, bookTitle, bookAuthor) => {
    if (!currentUser) return;

    try {
      // Update the book's availability status to false
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        available: false
      });

      // Add the book to the user's borrowed books sub-collection
      await addDoc(collection(db, `users/${currentUser.uid}/borrowedBooks`), {
        title: bookTitle,
        author: bookAuthor,
        borrowedDate: new Date().toLocaleDateString(),
        returnedDate: null // Set to null initially
      });

      // Refresh the lists
      fetchAvailableBooks();
      fetchBorrowedBooks(currentUser.uid);
      alert('Book borrowed successfully!');
    } catch (error) {
      console.error("Error borrowing the book:", error);
    }
  };

  // Return a borrowed book
  const handleReturnBook = async (borrowedBookId) => {
    if (!currentUser) return;

    try {
      // Get the borrowed book details
      const borrowedBookRef = doc(db, `users/${currentUser.uid}/borrowedBooks`, borrowedBookId);
      const borrowedBookSnapshot = await getDocs(borrowedBookRef);

      if (!borrowedBookSnapshot.exists()) {
        throw new Error("Borrowed book not found");
      }

      // Update the returned date in borrowedBooks collection
      await updateDoc(borrowedBookRef, {
        returnedDate: new Date().toLocaleDateString()
      });

      // Update the book's availability status to true
      const bookRef = doc(db, 'books', borrowedBookId); // Assuming borrowedBookId is also the book ID
      await updateDoc(bookRef, {
        available: true
      });

      // Refresh the lists
      fetchAvailableBooks();
      fetchBorrowedBooks(currentUser.uid);
      alert('Book returned successfully!');
    } catch (error) {
      console.error("Error returning the book:", error);
    }
  };

  // Fetch the available books when the component mounts
  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>

      <div className="available-books-section">
        <h2>Available Books</h2>
        <ul>
          {availableBooks.length > 0 ? (
            availableBooks.map(book => (
              <li key={book.id}>
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <button onClick={() => handleBorrowBook(book.id, book.title, book.author)}>
                  Borrow Book
                </button>
              </li>
            ))
          ) : (
            <p>No books available to borrow at the moment.</p>
          )}
        </ul>
      </div>

      <div className="borrowed-books-section">
        <h2>My Borrowed Books</h2>
        <ul>
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map(book => (
              <li key={book.id}>
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Borrowed Date:</strong> {book.borrowedDate}</p>
                {book.returnedDate ? (
                  <p><strong>Returned Date:</strong> {book.returnedDate}</p>
                ) : (
                  <button onClick={() => handleReturnBook(book.id)}>
                    Return Book
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>You have not borrowed any books.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;