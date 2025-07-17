import React from 'react'
import Post from './Post'

export default function Bundle({bundleInfo}) {
    return (
        <div>
            {bundleInfo && bundleInfo.map((post, index) => <Post key={index} post={post}></Post>)}
        </div>
    )
}
