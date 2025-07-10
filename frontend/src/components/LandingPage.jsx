import React from 'react'
import '../components-css/LandingPage.css'
import { Link } from 'react-router'

export default function LandingPage() {
  return (
    <div className='page'>
        <div className='landing-header'>
            <div className='landing-header-body'>
                <h2>All your dorm essentials, from students like you.</h2>
                <button><Link to="/home">Shop Now</Link></button>
            </div>
        </div>
        <div className='landing-body'>
            <h3>Trending Products</h3>
        </div>
    </div>
  )
}
