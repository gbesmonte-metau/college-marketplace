import React, { useState, useEffect } from 'react'
import '../components-css/ProfilePage.css'
import Post from './Post'

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState({});
    const [likedPosts, setLikedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);

    async function getProfile() {
        const response = await fetch(import.meta.env.VITE_URL + '/user', {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok){
            setUserInfo(result);
        }
    }

    async function getLikedPosts() {
        const response = await fetch(import.meta.env.VITE_URL + '/user/likes', {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok){
            setLikedPosts(result);
        }
    }

    async function getSavedPosts() {
        const response = await fetch(import.meta.env.VITE_URL + '/user/saves', {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok){
            setSavedPosts(result);
        }
    }

    useEffect(() => {
        getProfile();
        getLikedPosts();
        getSavedPosts();
    }, [])

    return (
        <div className='page'>
            <div className='profile-body'>
                <img className='profile-pic-large' src={userInfo.icon} alt="profile_pic" />
                <p>Username: {userInfo.username}</p>
                <p>Bio: {userInfo.bio}</p>
                <h2>Liked Posts:</h2>
                <div className='liked-posts'>
                    {likedPosts && likedPosts.length > 0 ? likedPosts.map(post => <Post post={post}></Post>) : <p>No liked posts</p>}
                </div>
                <h2>Saved Posts:</h2>
                <div className='saved-posts'>
                    {savedPosts && savedPosts.length > 0 ? savedPosts.map(post => <Post post={post}></Post>) : <p>No saved posts</p>}
                </div>

            </div>
        </div>
    )
}
