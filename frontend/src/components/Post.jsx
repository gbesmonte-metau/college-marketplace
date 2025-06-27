import React from 'react'
import { useNavigate } from 'react-router'

export default function Post({post}) {
  const navigate = useNavigate();
  function OpenPost(){
      navigate(`/post/${post.id}`);
  }

  return (
      <div onClick={OpenPost}>
          <p>{post.name}</p>
          <img className='post-image' src={post.image_url ? post.image_url : "../../public/placeholder.png"} alt={post.name}/>
          <p>${post.price.toFixed(2)}</p>
      </div>
  )
}
