import React from 'react'
import { Link , useNavigate} from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../App';
import '../components-css/Header.css'

export default function Header() {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  async function HandleLogout(e) {
        e.preventDefault();
        const settings = {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + '/user/logout', settings);
            const result = await response.json();
            setUser(null);
            navigate('/');
        }
        catch (error) {
            alert(error);
        }
  }

  return (
    <div className="app-header">
       <h1>College Marketplace</h1>
       <nav className='nav-bar'>
        <Link to='/'>Home</Link>
        {!user && <Link to='/login'>Login</Link>}
        {!user && <Link to='/register'>Register</Link>}
        {user && <Link to='/profile'>Profile</Link>}
        {user && <Link to='/myposts'>My Posts</Link>}
        {user && <button onClick={HandleLogout}>Logout</button>}
        {user && <img className="profile-pic" src={user.icon} alt="profile pic" />}
       </nav>
    </div>
  )
}
