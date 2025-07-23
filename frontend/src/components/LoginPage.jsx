import { useNavigate, Link } from "react-router";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import "../components-css/LoginPage.css";
import { MdErrorOutline } from "react-icons/md";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const settings = {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target[0].value,
        password: e.target[1].value,
      }),
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_URL + "/users/login",
        settings
      );
      const result = await response.json();
      if (response.ok) {
        setUser(result);
        navigate("/home", result);
      } else {
        setError(result.message);
      }
    } catch (error) {
      alert(error);
    }
  }
  return (
    <div className="page">
      <div className="login-box">
        <div className="login-body">
          <h2>Welcome Back!</h2>
          <form className="login-form" onSubmit={handleLogin}>
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
              <p>Password:</p>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className={`error-box ${error ? "visible" : "hidden"}`}>
            <MdErrorOutline /> <p> Error: {error || "No error"}</p>
          </div>
          <div>
            <p>
              No account? <Link to="/register">Register Here</Link>
            </p>
          </div>
        </div>
      </div>
      <div>
        <p>
          No account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}
