import { useEffect, useState } from "react";
import API from "../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p className="text-gray-500 p-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="mb-3">
        <p className="text-gray-600">Full Name</p>
        <p className="text-lg font-semibold">{user.username}</p>
      </div>

      <div className="mb-3">
        <p className="text-gray-600">Email</p>
        <p className="text-lg font-semibold">{user.email}</p>
      </div>

      <div className="mb-3">
        <p className="text-gray-600">Joined On</p>
        <p className="text-lg font-semibold">
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
