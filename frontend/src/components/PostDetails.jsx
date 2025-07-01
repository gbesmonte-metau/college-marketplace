import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect } from 'react';
import { categoryArr } from '../../utils';
import { useContext } from 'react'
import { UserContext } from '../App';
import EditPost from './EditPost';

export default function PostDetails() {
    const id = useParams().id;
    const [postDetails, setPostDetails] = useState(null);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        getPostDetails();
    }, [isEditOpen])

    async function getPostDetails() {
        try{
            const response = await fetch(import.meta.env.VITE_URL + `/posts/${id}`);
            const result = await response.json();
            if (response.ok) {
                setPostDetails(result);
            }
            else{
                alert(result);
            }
        }
        catch(error){
            alert(error);
        }
    }

    async function HandleDelete() {
        const response = await fetch(import.meta.env.VITE_URL + `/posts/${id}`, {
            credentials: 'include',
            method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok){
            navigate('/myposts');
        }
        else{
            alert("you are not the owner of this post")
        }
    }
    function OpenEdit(e){
        e.preventDefault();
        setIsEditOpen(true);
    }


    return (
        <div>
            {postDetails &&
            <div>
                <h1>{postDetails.name}</h1>
                <p>{postDetails.price}</p>
                <p>{postDetails.description}</p>
                <p>AuthorId: {postDetails.authorId}</p>
                <p>Location: {postDetails.location}</p>
                <p>Color: {postDetails.color}</p>
                <p>Brand: {postDetails.brand}</p>
                <p>Condition: {postDetails.condition}</p>
                <p>Category: {categoryArr[postDetails.category]}</p>
                <img src={postDetails.image_url} alt={postDetails.name} />
                <div>
                {user && user.id === postDetails.authorId && <button onClick={HandleDelete}>Delete Post</button>}
                {user && user.id === postDetails.authorId && <button onClick={OpenEdit}>Edit Post</button>}
                </div>
            </div>
            }
            {isEditOpen && <EditPost postDetails={postDetails} setIsEditOpen={setIsEditOpen}/>}
        </div>
    )
}
