import "../components-css/LandingPage.css";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import Post from "./Post";
import { getRequest } from "../api";

export default function LandingPage() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTrending();
  }, []);

  async function getTrending() {
    try {
      setIsLoading(true);
      const url = new URL(import.meta.env.VITE_URL + `/trending`);
      const response = await getRequest(url, false);
      const result = await response.json();
      if (response.ok) {
        setTrendingPosts(result);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="landing-header">
        <div className="landing-header-body">
          <h2>All your dorm essentials, from students like you.</h2>
          <button>
            <Link to="/home">Shop Now</Link>
          </button>
        </div>
      </div>
      <div className="landing-body">
        <h3>Trending Products</h3>
        <div className="trending-grid">
          {trendingPosts &&
            trendingPosts.map((post, index) => (
              <Post key={index} post={post}></Post>
            ))}
        </div>
      </div>
    </div>
  );
}
