import React, { useState } from "react";
import { ref, set, push } from "firebase/database";
import { db } from "../../firebase";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // نضيف user جديد برقم ID تلقائي
    const newUserRef = push(ref(db, "users"));
    await set(newUserRef, {
      ...formData,
      createdAt: new Date().toISOString(),
    });

    alert("✅ User added successfully!");
    setFormData({ name: "", email: "", role: "customer" });
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="cooker">Cooker</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>
        <br />

        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUserForm;
