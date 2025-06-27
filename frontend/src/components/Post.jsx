import React from 'react'
import { useNavigate } from 'react-router'

export default function Post({post}) {
    const navigate = useNavigate();
    function OpenPost(){
        navigate(`/post/${post.id}`);
    }

    async function HandleLike(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("Like");
        const response = await fetch(import.meta.env.VITE_URL + `/user/like/${post.id}`, {
            credentials: 'include',
            method: 'POST'
        });
        const result = await response.json();
        if (response.ok){
            alert("you liked this post");
        }
        else{
            alert(result.message);
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
            <button onClick={HandleLike}>Like</button>
            <button onClick={HandleSave}>Save</button>
        </div>
    )
}
