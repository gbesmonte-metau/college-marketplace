import Post from './Post'

export default function Bundle({bundleInfo, type}) {
    return (
        <div>
            {type}
            <div className='bundle-container'>
                {bundleInfo && bundleInfo.map((post, index) => <Post key={index} post={post}></Post>)}
            </div>
        </div>
    )
}
