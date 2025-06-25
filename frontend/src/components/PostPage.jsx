import React, { useEffect } from 'react'
import {useState} from 'react'
import Post from './Post'
import "../components-css/PostPage.css"

export default function PostPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        const posts = await fetch(import.meta.env.VITE_URL + '/posts');
        const postsJson = await posts.json();
        setPosts(postsJson);
    }

    return (
        <>
            <div className='search-bar'>
                <input type="text" placeholder='Search for a post' />
            </div>
            <div className='post-page'>
                <div className='post-grid'>
                {posts && posts.map((post,id) => (<Post key={id} post={post}></Post>))}
                </div>
            </div>
        </>
    )
}
