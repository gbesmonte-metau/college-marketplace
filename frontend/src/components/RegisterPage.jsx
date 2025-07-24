import { useNavigate, Link } from "react-router";
import { useState } from "react";
import "../components-css/RegisterPage.css";

import { MdErrorOutline } from "react-icons/md";
import { postRequest } from "../api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const body = {
      email: email,
      username: username,
      password: password,
    };
    try {
      const response = await postRequest(
        import.meta.env.VITE_URL + "/users/register",
        body
      );
      const result = await response.json();
      if (response.ok) {
        alert("You have successfully registered!");
        setError(null);
        navigate("/login", result);
      } else {
        setError(result.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="page">
      <div className="register-box">
        <div className="register-body">
          <h2>Welcome!</h2>
          <form className="register-form" onSubmit={handleRegister}>
            <div>
              <p>Email:</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Username:</p>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Password:</p>
              <input
                type="password"
                minLength={8}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Confirm Password:</p>
              <input
                type="password"
                minLength={8}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Register</button>
          </form>
          <div className={`error-box ${error ? "visible" : "hidden"}`}>
            <MdErrorOutline /> <p> Error: {error || "No error"}</p>
          </div>
          <div>
            <p>
              Already a user? <Link to="/login">Login Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
