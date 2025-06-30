import React from 'react'
import { useNavigate} from 'react-router'
import { useState, useEffect } from 'react';

export default function Post({post}) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        GetIsLiked();
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
        console.log("Save");
        const response = await fetch(import.meta.env.VITE_URL + `/user/save/${post.id}`, {
            credentials: 'include',
            method: 'POST'
        });
        const result = await response.json();
        if (response.ok){
            alert("you saved this post");
        }
        else{
            alert(result.message);
        }
    }

    return (
        <div onClick={OpenPost}>
            <p>{post.name}</p>
            <img className='post-image' src={post.image_url ? post.image_url : "../../public/placeholder.png"} alt={post.name}/>
            <p>${post.price.toFixed(2)}</p>
            <button onClick={HandleLike}>{isLiked ? "Unlike" : "Like" }</button>
            <button onClick={HandleSave}>Save</button>
        </div>
    )
}
