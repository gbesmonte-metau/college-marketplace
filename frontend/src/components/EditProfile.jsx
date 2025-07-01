import React from 'react'


export default function EditProfile({setIsEditOpen}) {
  return (
    <div className="edit-modal">
        <div className='edit-body'>
            <h1>Edit Profile</h1>
            <p>Coming soon...</p>
            <button onClick={() => setIsEditOpen(false)}>Close</button>
        </div>
    </div>
  )
}
