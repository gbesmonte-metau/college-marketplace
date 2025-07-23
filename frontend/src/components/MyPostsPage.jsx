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

  async function getMyPosts() {
    setIsLoading(true);
    const url = new URL(import.meta.env.VITE_URL + `/authored`);
    const response = await getRequest(url, true);
    const result = await response.json();
    if (response.ok) {
      setMyPosts(result);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getMyPosts();
  }, [isCreatePostOpen]);

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="mypost-body">
        <h2>My Posts</h2>
        <div className="create-btn">
          <button onClick={() => setIsCreatePostOpen(true)}>Create Post</button>
        </div>
        <div className="mypost-grid">
          {myPosts &&
            myPosts.map((post, idx) => <Post key={idx} post={post}></Post>)}
        </div>
      </div>
      {isCreatePostOpen && (
        <CreatePost setIsCreatePostOpen={setIsCreatePostOpen} />
      )}
    </div>
  );
}
