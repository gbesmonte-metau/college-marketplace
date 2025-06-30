import React from 'react'
import { useNavigate} from 'react-router'
import { useState, useEffect } from 'react';
import { useContext } from 'react'
import { UserContext } from '../App';

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

export default function Post({post}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (user){
            GetIsLiked();
            GetIsSaved();
        }
    }, []);

    const navigate = useNavigate();
    function OpenPost(){
        navigate(`/post/${post.id}`);
    }

    async function GetIsLiked(){
        try{
            const response = await fetch(import.meta.env.VITE_URL + `/user/like/${post.id}`, {
                credentials: 'include',
            });
            const result = await response.json();
            if (result.liked){
                setIsLiked(true);
            }
            else {
                setIsLiked(false);
            }
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
            if (result.saved){
                setIsSaved(true);
            }
            else {
                setIsSaved(false);
            }
        }
        catch (e){
            alert(e);
        }

    }

    async function HandleLike(e){
        e.preventDefault();
        e.stopPropagation();
        try{
            if (isLiked){
                const response = await fetch(import.meta.env.VITE_URL + `/user/unlike/${post.id}`, {
                    credentials: 'include',
                    method: 'DELETE'
                });
                if (response.ok){
                    setIsLiked(false);
                }
            }
            else{
                const response = await fetch(import.meta.env.VITE_URL + `/user/like/${post.id}`, {
                    credentials: 'include',
                    method: 'POST'
                });
                if (response.ok){
                    setIsLiked(true);
                }
            }
        }
        catch (e){
            alert(e);
        }
    }

    async function HandleSave(e){
        e.preventDefault();
        e.stopPropagation();
        try{
            if (isSaved){
                const response = await fetch(import.meta.env.VITE_URL + `/user/unsave/${post.id}`, {
                    credentials: 'include',
                    method: 'DELETE'
                });
                if (response.ok){
                    setIsSaved(false);
                }
            }
            else{
                const response = await fetch(import.meta.env.VITE_URL + `/user/save/${post.id}`, {
                    credentials: 'include',
                    method: 'POST'
                });
                if (response.ok){
                    setIsSaved(true);
                }
            }
        }
        catch (e){
            alert(e);
        }
    }

    return (
        <div onClick={OpenPost}>
            <p>{post.name}</p>
            <img className='post-image' src={post.image_url ? post.image_url : "../../public/placeholder.png"} alt={post.name}/>
            <p>${post.price.toFixed(2)}</p>
            <button onClick={HandleLike}>{isLiked ? <FaHeart/> : <FaRegHeart/> }</button>
            <button onClick={HandleSave}>{isSaved ? <FaBookmark/> : <FaRegBookmark/> }</button>
        </div>
    )
}
