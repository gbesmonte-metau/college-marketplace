import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";
import "../components-css/Header.css";

export default function Header() {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  async function handleLogout(e) {
    e.preventDefault();
    const settings = {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_URL + "/user/logout",
        settings,
      );
      const result = await response.json();
      setUser(null);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  }

  function handleTitleClick(e) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="app-header">
      <h1 onClick={handleTitleClick}>College Marketplace</h1>
      <nav className="nav-bar">
        <Link to="/home">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <Link to="/foryou">For You</Link>}
        {user && <Link to="/bundles">Bundles</Link>}
        {user && <Link to="/myposts">My Posts</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
        {user && (
          <img
            className="profile-pic"
            src={user.icon || "../../public/placeholder.png"}
            alt="profile pic"
          />
        )}
      </nav>
    </div>
  );
}
