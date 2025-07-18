import Post from './Post'

export default function Bundle({bundleItems, type}) {
    return (
        <div>
            <h3>Bundle:</h3>
            <div className='bundle-container'>
                {bundleItems && bundleItems.map((post, index) => <Post key={index} post={post}></Post>)}
            </div>
        </div>
    )
}
