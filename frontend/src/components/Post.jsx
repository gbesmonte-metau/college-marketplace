import React from 'react'

export default function Post({post}) {
  return (
    <div>
       <p>{post.name}</p>
       <img className='post-image' src={post.image_url ? post.image_url : "../../public/placeholder.png"} alt={post.name}/>
       <p>${post.price.toFixed(2)}</p>
    </div>
  )
}
