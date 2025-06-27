import React, { useState, useEffect } from 'react'

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState({});

    async function getProfile() {
        const response = await fetch(import.meta.env.VITE_URL + '/user', {
            credentials: 'include'
        });
        const result = await response.json();
        if (response.ok){
            setUserInfo(result);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <div>
            <p>User: {userInfo.username}</p>
            <p>Bio: {userInfo.bio}</p>
        </div>
    )
}
