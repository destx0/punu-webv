"use client";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseConfig";

const UserProfile = ({ user, onLogout }) => {
  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl mb-4">Welcome, {user.email}</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;