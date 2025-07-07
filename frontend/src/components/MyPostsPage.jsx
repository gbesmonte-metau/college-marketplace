import React from 'react';
import Post from './Post';
import { useEffect, useState } from 'react';
import '../components-css/MyPostsPage.css'
import CreatePost from './CreatePost';

export default function MyPostsPage() {
    const [myPosts, setMyPosts] = useState([]);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

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
    }, [isCreatePostOpen])

    return (
        <div className='page'>
            <div className="mypost-body">
                <h2>My Posts</h2>
                <div className='create-btn'>
                    <button onClick={() => setIsCreatePostOpen(true)}>Create Post</button>
                </div>
                <div className='mypost-grid'>
                    {myPosts && myPosts.map((post,idx) => (<Post key={idx} post={post}></Post>))}
                </div>
            </div>
            {isCreatePostOpen && <CreatePost setIsCreatePostOpen={setIsCreatePostOpen}/>}
        </div>
    )
}
