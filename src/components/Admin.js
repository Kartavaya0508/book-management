import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');

  // Fetch users from the Firestore database
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch available books from Firestore
  const fetchAvailableBooks = async () => {
    try {
      const booksSnapshot = await getDocs(collection(db, 'books'));
      const availableBooksList = booksSnapshot.docs.filter(doc => doc.data().available).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(availableBooksList);
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
  };

  // Add a new book to Firestore
  const handleAddBook = async () => {
    if (!newBookTitle || !newBookAuthor) {
      alert('Please enter both title and author.');
      return;
    }

    try {
      await addDoc(collection(db, 'books'), {
        title: newBookTitle,
        author: newBookAuthor,
        available: true // New books are available by default
      });
      setNewBookTitle('');
      setNewBookAuthor('');
      fetchAvailableBooks(); // Refresh the list after adding a new book
      alert('Book added successfully!');
    } catch (error) {
      console.error("Error adding the book:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAvailableBooks();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="add-book-section">
        <h2>Add New Book</h2>
        <input 
          type="text" 
          value={newBookTitle} 
          onChange={(e) => setNewBookTitle(e.target.value)} 
          placeholder="Book Title" 
        />
        <input 
          type="text" 
          value={newBookAuthor} 
          onChange={(e) => setNewBookAuthor(e.target.value)} 
          placeholder="Book Author" 
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div className="available-books-section">
        <h2>Available Books</h2>
        <ul>
          {books.length > 0 ? (
            books.map(book => (
              <li key={book.id}>
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Author:</strong> {book.author}</p>
              </li>
            ))
          ) : (
            <p>No available books.</p>
          )}
        </ul>
      </div>

      <h2>User Accounts</h2>
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Borrowed Books:</strong></p>
              <ul>
                {user.borrowedBooks && user.borrowedBooks.length > 0 ? (
                  user.borrowedBooks.map((book, index) => (
                    <li key={index}>
                      {book.title} (Borrowed on: {book.borrowedDate.toDate().toDateString()})
                      {book.returnedDate && `, Returned on: ${book.returnedDate.toDate().toDateString()}`}
                    </li>
                  ))
                ) : (
                  <li>No borrowed books</li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default Admin;
