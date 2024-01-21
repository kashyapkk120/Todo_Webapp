
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './Account.css';


const storage = getStorage();

const Account = () => {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

 
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await auth.currentUser.reload();
        const updatedUserId = auth.currentUser?.uid;

        if (!updatedUserId) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();

    const q = collection(firestore, 'todos');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedTodos = querySnapshot.docs
        .filter(doc => doc.data().userId === auth.currentUser?.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(updatedTodos);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Function to add a new todo
  const addTodo = async () => {
    if (!auth.currentUser?.uid || !newTodo || !dueDate || (!image && uploading)) return;

    const userEmail = auth.currentUser?.email;
    const timestamp = new Date().toISOString();

    let imageUrl = null;

    if (image) {
      setUploading(true);

      const filename = `${auth.currentUser?.uid}_${new Date().getTime()}_${image.name}`;
      const storageRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            imageUrl = downloadURL;
            setUploading(false);
            setUploadProgress(0);

            // Add the todo to Firestore with the imageUrl
            addDoc(collection(firestore, 'todos'), {
              userId: auth.currentUser?.uid,
              userEmail,
              todo: newTodo,
              completed: false,
              dueDate,
              timestamp,
              imageUrl,
            });

            setNewTodo('');
            setDueDate('');
            setImage(null);
          });
        }
      );
    } else {

      // Add the todo to Firestore 
      await addDoc(collection(firestore, 'todos'), {
        userId: auth.currentUser?.uid,
        userEmail,
        todo: newTodo,
        completed: false,
        dueDate,
        timestamp,
        imageUrl,
      });

      setNewTodo('');
      setDueDate('');
      setImage(null);
    }
  };

  // handle image 
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // remove
  const removeTodo = async (id) => {
    if (!auth.currentUser?.uid) return;

    await deleteDoc(doc(firestore, 'todos', id));
  };

  // mark 
  const completeTodo = async (id, completed) => {
    if (!auth.currentUser?.uid) return;

    await setDoc(doc(firestore, 'todos', id), { completed: !completed }, { merge: true });
  };

  // logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container">
      <h2>Welcome to Your Account</h2>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <a
              href="#"
              className={`todo-text ${todo.completed ? 'todo-completed' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              {todo.todo}
            </a>
            <p className="todo-details">
              <strong> Due Date:</strong> {todo.dueDate} |
              <strong> Timestamp:</strong> {todo.timestamp}
            </p>
            {todo.imageUrl && (
              <img
                src={todo.imageUrl}
                alt="Todo"
                className="todo-image-preview"
                onClick={() => window.open(todo.imageUrl, '_blank')}
              />
            )}
            <div className="todo-buttons">
              <button
                className={`complete-button ${todo.completed ? 'undo-button' : ''}`}
                onClick={() => completeTodo(todo.id, todo.completed)}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button className="remove-button" onClick={() => removeTodo(todo.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-todo-container">
        <input
          type="text"
          placeholder="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        {image && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(image)}
              alt="Image Preview"
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
            />
          </div>
        )}
        {uploading && (
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="upload-progress" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p>{`Uploading... ${Math.round(uploadProgress)}%`}</p>
          </div>
        )}
        <button onClick={addTodo} disabled={uploading}>Add Todo</button>
      </div>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Account;
