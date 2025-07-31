import Post from "./Post";
import { useEffect, useState } from "react";
import "../components-css/MyPostsPage.css";
import CreatePost from "./CreatePost";
import { getRequest } from "../api";
import Loading from "./Loading";

export default function MyPostsPage() {
  const [myPosts, setMyPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSoldPosts, setHasSoldPosts] = useState(false);

  async function getMyPosts() {
    setIsLoading(true);
    const url = new URL(import.meta.env.VITE_URL + `/authored`);
    const response = await getRequest(url, true);
    let result = await response.json();
    if (response.ok) {
      if (!hasSoldPosts){
        result = result.filter(post => post.time_sold == null);
      }
      setMyPosts(result);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getMyPosts();
  }, [isCreatePostOpen, hasSoldPosts]);

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="mypost-body">
        <h2>My Posts</h2>
        <div className="create-btn">
          <button onClick={() => setIsCreatePostOpen(true)}>Create Post</button>
        </div>
        <div>
          <input type="checkbox" id="toggleSoldPosts" name="toggleSoldPosts" value={hasSoldPosts} onChange={(e) => setHasSoldPosts(!hasSoldPosts)}/>
          <label for="toggleSoldPosts">Show Sold Posts</label>
        </div>
        <div className="mypost-container">
          <div className="mypost-grid">
            {myPosts &&
              myPosts.map((post, idx) => <Post key={idx} post={post}></Post>)}
          </div>
        </div>
      </div>
      {isCreatePostOpen && (
        <CreatePost setIsCreatePostOpen={setIsCreatePostOpen} />
      )}
    </div>
  );
}
