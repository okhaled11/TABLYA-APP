import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users/{user_id}");

    // نفتح Stream لحظي مع قاعدة البيانات
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(formatted);
      } else {
        setUsers([]);
      }
    });

    // لما يتقفل الكومبوننت نوقف الاستماع
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>All Users (Live)</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
                background: "#f9f9f9",
              }}
            >
              <strong>{user.name}</strong> <br />
              📧 {user.email} <br />
              🎭 Role: {user.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;
