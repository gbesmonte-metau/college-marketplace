import React from 'react'
import { Link } from 'react-router'
import { useContext } from 'react'
import { UserContext } from '../App';

export default function Header() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div className="app-header">
       <h1>College Marketplace</h1>
       <nav className='nav-bar'>
        <Link to='/'>Home</Link>
        {!user && <Link to='/login'>Login</Link>}
        {!user && <Link to='/register'>Register</Link>}
        {user && <Link to='/profile'>Profile</Link>}
       </nav>
    </div>
  )
}
