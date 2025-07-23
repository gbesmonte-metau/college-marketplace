import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";
import "../components-css/Header.css";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
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

  const isLocation = (path) => {
    return location.pathname == path;
  }

  return (
    <div className="app-header">
       <h1 onClick={HandleTitleClick}>College Marketplace</h1>
       <nav className='nav-bar'>
        <Link to='/home' className={isLocation('/home') ? 'active' : ''}>Home</Link>
        {!user && <Link to='/login' className={isLocation('/login') ? 'active' : ''}>Login</Link>}
        {!user && <Link to='/register' className={isLocation('/register') ? 'active' : ''}>Register</Link>}
        {user && <Link to='/foryou' className={isLocation('/foryou') ? 'active' : ''}>For You</Link>}
        {user && <Link to='/bundles' className={isLocation('/bundles') ? 'active' : ''}>Bundles</Link>}
        {user && <Link to='/myposts' className={isLocation('/myposts') ? 'active' : ''}>My Posts</Link>}
        {user && <Link to='/profile' className={isLocation('/profile') ? 'active' : ''}>Profile</Link>}
        {user && <button onClick={HandleLogout}>Logout</button>}
        {user && <img className="profile-pic" src={user.icon || "../../public/placeholder.png"} alt="profile pic" />}
       </nav>
    </div>
  );
}
