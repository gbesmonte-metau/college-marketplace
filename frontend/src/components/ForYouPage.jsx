import { useState, useEffect } from "react";
import Post from "./Post";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../App";
import "../components-css/ForYouPage.css";
import Loading from "./Loading";
import { getRequest } from "../api";
import RecommendedPost from "./RecommendedPost";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

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

  function IncrementIndex(e) {
    e.preventDefault();
    setRecommendedPostIdx(recommendedPostIdx + 1);
  }
  function DecrementIndex(e) {
    e.preventDefault();
    setRecommendedPostIdx(recommendedPostIdx - 1);
  }

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="recommended-body">
        <h2>Recommended Posts</h2>
        <div className="recommended-container">
          <div className="arrow-container">
            {recommendedPostIdx != 0 && (
              <button
                type="button"
                className="skip-button"
                onClick={DecrementIndex}
              >
                <MdNavigateBefore />
              </button>
            )}
          </div>
          {recommendedPosts.length > 0 && (
            <RecommendedPost post={recommendedPosts[recommendedPostIdx]} />
          )}

          <div className="arrow-container">
            {recommendedPostIdx != recommendedPosts.length - 1 && (
              <button
                type="button"
                className="skip-button"
                onClick={IncrementIndex}
              >
                <MdNavigateNext />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
