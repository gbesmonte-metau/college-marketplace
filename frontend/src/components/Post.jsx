import React from 'react'

export default function Post({post}) {
  return (
    <div>
       <p>{post.name}</p>
       <img src={post.image_url} alt={post.name}/>
       <p>${post.price.toFixed(2)}</p>
    </div>
  )
}
