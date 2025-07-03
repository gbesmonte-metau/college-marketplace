import React, { useEffect } from 'react'
import {useState} from 'react'
import Post from './Post'
import "../components-css/PostPage.css"
import Filter from './Filter'
import CreatePost from './CreatePost'
import { GetCategoryIdByName } from '../../utils'

export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({});
    const [search, setSearch] = useState("");
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    useEffect(() => {
        getPosts();
    }, [filter, isCreatePostOpen]);

    async function getPosts() {
        const url = new URL(import.meta.env.VITE_URL + '/posts');
        const params = new URLSearchParams();

        if (filter.price) {
            params.append("price", filter.price);
        }
        if (filter.search) {
            params.append("search", filter.search);
        }
        if (filter.category){
            for (const categoryStr of filter.category){
                if (filter[categoryStr] !== 'All'){
                    params.append("category", GetCategoryIdByName(categoryStr));
                }
            }
        }
        if (filter.color){
            for (const colorStr of filter.color){
                params.append("color", colorStr);
            }
        }
        if (filter.condition){
            for (const conditionStr of filter.condition){
                params.append("condition", conditionStr);
            }
        }
        if (filter.distance && filter.distance !== "All"){
            params.append("distance", filter.distance);
        }

        const queryString = params.toString();
        const fetchUrl = queryString ? `${url}?${queryString}` : url.toString();

        const response = await fetch(fetchUrl, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) {
            setPosts([]);
        }
        else{
            setPosts(result);
        }
    }

    function HandleSearch(e){
        e.preventDefault();
        setFilter({...filter, search: search});
    }
    function HandleClear(e){
        e.preventDefault();
        setSearch("");
        setFilter({...filter, search: ""});
    }

    return (
        <div className='page'>
            <div className='search-bar'>
                <form onSubmit={HandleSearch}>
                    <input name="search" type="text" placeholder='Search for a post' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button type="submit">Search</button>
                    <button onClick={HandleClear}>Clear</button>
                </form>
            </div>
            <div className='create-btn'>
                <button onClick={() => setIsCreatePostOpen(true)}>Create Post</button>
            </div>
            <div className='post-body'>
                <Filter filter={filter} setFilter={setFilter}/>
                <div className='post-page'>
                    <div className='post-grid'>
                    {posts.length > 0 ? posts.map((post,id) => (<Post key={id} post={post}></Post>)) : <h2>No posts found</h2>}
                    </div>
                </div>
            </div>
            {isCreatePostOpen && <CreatePost setIsCreatePostOpen={setIsCreatePostOpen}/>}
        </div>
    )
}
