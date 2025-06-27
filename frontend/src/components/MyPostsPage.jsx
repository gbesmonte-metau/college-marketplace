import React from 'react';
import Post from './Post';
import { useEffect, useState } from 'react';
import '../components-css/MyPostsPage.css'

export default function MyPostsPage() {
    const [myPosts, setMyPosts] = useState([]);

    async function getMyPosts() {
        const response = await fetch(import.meta.env.VITE_URL + '/authored', {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok){
            setMyPosts(result);
        }
    }

    useEffect(() => {
        getMyPosts();
    }, [])

    return (
        <div className="mypost-body">
            {myPosts && myPosts.map((post,idx) => (<Post key={idx} post={post}></Post>))}
        </div>
    )
}
