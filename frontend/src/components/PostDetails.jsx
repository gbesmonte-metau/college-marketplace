import React from 'react'
import { useLocation, useParams } from 'react-router'
import { useState, useEffect } from 'react';

export default function PostDetails() {
    const id = useParams().id;
    const [postDetails, setPostDetails] = useState(null);

    useEffect(() => {
        getPostDetails();
    }, [])

    async function getPostDetails() {
        try{
            const response = await fetch(import.meta.env.VITE_URL + `/posts/${id}`);
            const result = await response.json();
            if (response.ok) {
                setPostDetails(result);
            }
            else{
                console.log(result);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            {postDetails &&
            <div>
                <h1>{postDetails.name}</h1>
                <p>{postDetails.price}</p>
                <p>{postDetails.description}</p>
                <img src={postDetails.image_url} alt={postDetails.name} />
            </div>
            }
        </div>
    )
}
