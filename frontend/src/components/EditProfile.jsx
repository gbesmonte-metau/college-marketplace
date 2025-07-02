import React from 'react'
import { useState } from 'react'
import UploadImage from './UploadImage'
import AddressForm from './AddressForm'

export default function EditProfile({userInfo, setIsEditOpen}) {
    const [icon, setIcon] = useState(userInfo.icon);
    const [bio, setBio] = useState(userInfo.bio);
    const [location, setLocation] = useState(userInfo.location);
    const [address, setAddress] = useState(userInfo.address);

    async function HandleEdit(e) {
        e.preventDefault();
        const settings = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                icon: icon,
                bio: bio,
                location: location,
                formatted_address: address,
            })
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + `/user`, settings);
            const result = await response.json();
            if (response.ok){
                alert("User edit");
                setIsEditOpen(false);
            }
            else{
                alert(result.message);
            }
        }
        catch (error) {
            alert(error);
        }
    }

    return (
        <div className="edit-modal">
            <div className='edit-body'>
                    <form onSubmit={HandleEdit}>
                        <div>
                            <p>Icon</p>
                            <UploadImage url={icon} setUrl={setIcon}/>
                        </div>
                        <div>
                            <p>Bio</p>
                            <input name="bio" type='text' placeholder='Bio' value={bio} onChange={(e) => setBio(e.target.value)} required/>
                        </div>
                        <AddressForm setLocation={setLocation} setFormattedAddr={setAddress}/>
                        <button type='submit'>Save</button>
                    </form>
                <button onClick={() => setIsEditOpen(false)}>Close</button>
            </div>
        </div>
    )
}
