import React from 'react'
import { useNavigate} from 'react-router'
import { useState, useEffect } from 'react';
import { useContext } from 'react'
import { UserContext } from '../App';

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import "../components-css/Post.css"

export default function Post({post}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        Initialize();
    }, [user]);

    async function Initialize(){
        if (user){
            await GetIsLiked();
            await GetIsSaved();
        }
        else {
            setIsLiked(false);
            setIsSaved(false);
        }
    }

    const navigate = useNavigate();
    async function OpenPost(){
        if (!user){
            navigate("/login");
        }
        else {
            try {
                const response = await fetch(import.meta.env.VITE_URL + `/user/view/${post.id}`, {
                    method: 'POST',
                    credentials: 'include',
                });
                const result = await response.json();
                if (response.ok){
                    navigate(`/posts/${post.id}`);
                }
            }
            catch (e){
                alert(e);
            }
        }
    }

    async function GetIsLiked(){
        try{
            const response = await fetch(import.meta.env.VITE_URL + `/user/like/${post.id}`, {
                credentials: 'include',
            });
            const result = await response.json();
            setIsLiked(result.liked);
        }
        catch (e){
            alert(e);
        }
    }
    async function GetIsSaved(){
        try{
            const response = await fetch(import.meta.env.VITE_URL + `/user/save/${post.id}`, {
                credentials: 'include',
            });
            const result = await response.json();
            setIsSaved(result.saved);
        }
        catch (e){
            alert(e);
        }

    }

    async function HandleLike(e){
        e.preventDefault();
        e.stopPropagation();
        const URL = import.meta.env.VITE_URL + (isLiked ? `/user/unlike/${post.id}` : `/user/like/${post.id}`);
        try{
            const response = await fetch(URL, {
                credentials: 'include',
                method: 'POST'
            });
            if (response.ok){
                setIsLiked(!isLiked);
            }
            else {
                alert("You must be logged in to like a post");
            }
        }
        catch (e){
            alert(e);
        }
    }

    async function HandleSave(e){
        e.preventDefault();
        e.stopPropagation();
        const URL = import.meta.env.VITE_URL + (isSaved ? `/user/unsave/${post.id}` : `/user/save/${post.id}`);
        try{
            const response = await fetch(URL, {
                credentials: 'include',
                method: 'POST'
            });
            if (response.ok){
                setIsSaved(!isSaved);
            }
            else {
                alert("You must be logged in to save a post");
            }
        }
        catch (e){
            alert(e);
        }
    }

    return (
        <div className="post" onClick={OpenPost}>
            <img className='post-image' src={post.image_url ? post.image_url : "../../public/placeholder.png"} alt={post.name}/>
            <div className='post-content'>
                <p>{post.name}</p>
                <p className='price-tag'>${post.price.toFixed(2)}</p>
                <div className='post-buttons'>
                    <button onClick={HandleLike}>{isLiked ? <FaHeart/> : <FaRegHeart/> }</button>
                    <button onClick={HandleSave}>{isSaved ? <FaBookmark/> : <FaRegBookmark/> }</button>
                </div>
            </div>
        </div>
    )
}
