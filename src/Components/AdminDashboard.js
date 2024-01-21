
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

import './AdminDashboard.css';
const AdminDashboard = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const q = collection(firestore, 'todos');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedTodos = [];
      querySnapshot.forEach((doc) => {
        const todoData = doc.data();
        updatedTodos.push({ id: doc.id, ...todoData });
      });
      setTodos(updatedTodos);
    });

    return () => unsubscribe();
  }, []);

  const removeTodo = async (id) => {
    await deleteDoc(doc(firestore, 'todos', id));
  };

  return (
    <div className="container">
      <h2>Welcome to Admin Dashboard</h2>
      <div className="todo-list">
        <h3>All Todos</h3>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className={`todo-text ${todo.completed ? 'todo-completed' : ''}`}>
                {todo.todo}
              </span>
              <p className="todo-details">
                <strong>Email:</strong> {todo.userEmail} |
                <strong> Timestamp:</strong> {todo.timestamp}
              </p>
              <button className="remove-button" onClick={() => removeTodo(todo.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
