// src/auth.js
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from './firebase';

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = () => signOut(auth);

export default { signIn, register, signOutUser };
