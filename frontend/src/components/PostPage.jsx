import React, { useEffect } from 'react'
import {useState} from 'react'
import Post from './Post'
import "../components-css/PostPage.css"
import Filter from './Filter'
import {category, categoryArr} from "../App"

export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({});

    useEffect(() => {
        getPosts();
    }, [filter]);

    async function getPosts() {
        const url = new URL(import.meta.env.VITE_URL + '/posts');
        const parseFilter = {
            price: filter.price,
        }
        const params = new URLSearchParams(parseFilter);
        if (filter.category){
            for (const categoryStr of filter.category){
                if (filter[categoryStr] !== 'All'){
                    params.append("category", category[categoryStr]);
                }
            }
        }
        const response = await fetch(url + '?' + params.toString());
        const result = await response.json();
        if (!response.ok) {
            setPosts([]);
        }
        else{
            setPosts(result);
        }
    }

    return (
        <>
            <div className='search-bar'>
                <input type="text" placeholder='Search for a post' />
            </div>
            <div className='post-body'>
                <Filter filter={filter} setFilter={setFilter}/>
                <div className='post-page'>
                    <div className='post-grid'>
                    {posts.length > 0 && posts.map((post,id) => (<Post key={id} post={post}></Post>))}
                    {posts.length == 0 && <h2>No posts found</h2>}
                    </div>
                </div>
            </div>
        </>
    )
}
