import Post from './Post'
import "../components-css/Bundle.css"

export default function Bundle({bundleItems, type}) {
    return (
        <div className='bundle'>
            <h3>Bundle: {type}</h3>
            <div className='bundle-container'>
                {bundleItems && bundleItems.length > 0 ? bundleItems.map((post, index) => <Post key={index} post={post}></Post>) : <p>No bundle found</p>}
            </div>
        </div>
    )
}
