import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
export default function TestLog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Login:", result.user);
      console.log("Inside handleGoogleLogin");
      alert(`Welcome ${result.user.displayName}`);
    } catch (error) {
      console.error(error);
      console.log("Inside handleGoogleLogin");
      alert(error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inside handleGoogleLogin");
      alert("Logged in successfully!");
    } catch (error) {
      console.log("Inside handleGoogleLogin");
      alert(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Inside handleGoogleLogin");
      alert("Account created successfully!");
    } catch (error) {
      console.log("Inside handleGoogleLogin");
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleEmailLogin}>Login</button>
      <hr />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
