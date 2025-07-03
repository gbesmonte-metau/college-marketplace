import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router';

export default function OtherProfilePage() {
    const [userInfo, setUserInfo] = useState({});
    const id = useParams().id;

    async function getProfile() {
        const response = await fetch(import.meta.env.VITE_URL + `/users/${id}`);
        const result = await response.json();
        if (response.ok){
            setUserInfo(result);
        }
        else{
            alert(result.message)
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <div className='page'>
            <div className='profile-body'>
                <img className='profile-pic-large' src={userInfo.icon} alt="profile_pic" />
                <p>Username: {userInfo.username}</p>
                <p>Bio: {userInfo.bio}</p>
                <p>Location: {userInfo.formatted_address ? userInfo.formatted_address : "No location"}</p>
            </div>
        </div>
    )
}
