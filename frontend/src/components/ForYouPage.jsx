import { useState, useEffect } from "react";
import Post from "./Post";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";
import "../components-css/ForYouPage.css";

export default function ForYouPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  async function getRecommendedPosts() {
    const response = await fetch(
      import.meta.env.VITE_URL + "/user/recommendations",
      {
        credentials: "include",
      },
    );
    const result = await response.json();
    if (response.ok) {
      setPosts(result);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    getRecommendedPosts();
  }, []);

  return (
    <div className="page">
      <div className="recommended-body">
        <h2>Recommended Posts</h2>
        <div className="recommended-container">
          {posts &&
            posts.map((post, idx) => <Post key={idx} post={post}></Post>)}
        </div>
      </div>
    </div>
  );
}
