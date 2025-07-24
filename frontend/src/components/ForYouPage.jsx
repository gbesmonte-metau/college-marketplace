import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";
import "../components-css/ForYouPage.css";
import Loading from "./Loading";
import { getRequest } from "../api";
import RecommendedPost from "./RecommendedPost";

export default function ForYouPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [recommendedPostIdx, setRecommendedPostIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function getRecommendedPosts() {
    setIsLoading(true);
    const url = new URL(import.meta.env.VITE_URL + "/user/recommendations");
    const response = await getRequest(url, true);
    const result = await response.json();
    if (response.ok) {
      setRecommendedPosts(result);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
    getRecommendedPosts();
  }, [user]);

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="recommended-body">
        <h2>Recommended Posts</h2>
        <div className="recommended-container">
          {recommendedPosts.length > 0 && (
            <RecommendedPost
              post={recommendedPosts[recommendedPostIdx]}
              recommendedPosts={recommendedPosts}
              recommendedPostIdx={recommendedPostIdx}
              setRecommendedPostIdx={setRecommendedPostIdx}
            />
          )}
        </div>
      </div>
    </div>
  );
}
