import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../App";

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import "../components-css/RecommendedPost.css";
import { getRequest, postRequest } from "../api";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

export default function RecommendedPost({
  post,
  recommendedPosts,
  recommendedPostIdx,
  setRecommendedPostIdx,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const { user, setUser } = useContext(UserContext);
  const [isFeedbackPositive, setIsFeedbackPositive] = useState(false);

  useEffect(() => {
    initialize();
  }, [user]);

  // when post changes
  useEffect(() => {
    initialize();
    getLikeSaveCount();
    setIsFeedbackPositive(false);
  }, [post]);

  async function createRecommendation() {
    let currentFeedback = false;
    if (isLiked || isSaved){
        currentFeedback = true; 
        setIsFeedbackPositive(currentFeedback);
    }
    const body = {
        "bestCategory": post.best_category,
        "isFeedbackPositive": currentFeedback
    }
    const response = await postRequest(
        import.meta.env.VITE_URL + `/user/recommended/${post.id}`,
        body
    )
  }

  async function getLikeSaveCount() {
    const response = await getRequest(
      import.meta.env.VITE_URL + `/posts/${post.id}`,
      false
    );
    const result = await response.json();
    if (response.ok) {
      setLocalPost(result);
    }
  }

  async function incrementIndex(e) {
    e.preventDefault();
    await createRecommendation();
    setRecommendedPostIdx(recommendedPostIdx + 1);
  }
  async function decrementIndex(e) {
    e.preventDefault();
    await createRecommendation();
    setRecommendedPostIdx(recommendedPostIdx - 1);
  }

  async function initialize() {
    if (user) {
      await getIsLiked();
      await getIsSaved();
    } else {
      setIsLiked(false);
      setIsSaved(false);
    }
  }

  const navigate = useNavigate();
  async function openPost() {
    if (!user) {
      navigate("/login");
    } else {
      try {
        const url = new URL(import.meta.env.VITE_URL + `/user/view/${post.id}`);
        const response = await postRequest(url, {});
        const result = await response.json();
        if (response.ok) {
          navigate(`/posts/${post.id}`);
        }
      } catch (e) {
        alert(e);
      }
    }
  }

  async function getIsLiked() {
    try {
      const url = new URL(import.meta.env.VITE_URL + `/user/like/${post.id}`);
      const response = await getRequest(url, true);
      const result = await response.json();
      setIsLiked(result.liked);
    } catch (e) {
      alert(e);
    }
  }
  
  async function getIsSaved() {
    try {
      const url = new URL(import.meta.env.VITE_URL + `/user/save/${post.id}`);
      const response = await getRequest(url, true);
      const result = await response.json();
      setIsSaved(result.saved);
    } catch (e) {
      alert(e);
    }
  }

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    const URL =
      import.meta.env.VITE_URL +
      (isLiked ? `/user/unlike/${post.id}` : `/user/like/${post.id}`);
    try {
      const response = await postRequest(URL, {});
      if (response.ok) {
        if (isLiked) {
          setLocalPost({
            ...localPost,
            _count: {
              ...localPost._count,
              usersLiked: localPost._count.usersLiked - 1,
            },
          });
        } else {
          setLocalPost({
            ...localPost,
            _count: {
              ...localPost._count,
              usersLiked: localPost._count.usersLiked + 1,
            },
          });
        }
        setIsLiked(!isLiked);
      } else {
        alert("You must be logged in to like a post");
      }
    } catch (e) {
      alert(e);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    const URL =
      import.meta.env.VITE_URL +
      (isSaved ? `/user/unsave/${post.id}` : `/user/save/${post.id}`);
    try {
      const response = await postRequest(URL, {});
      if (response.ok) {
        if (isSaved) {
          setLocalPost({
            ...localPost,
            _count: {
              ...localPost._count,
              usersSaved: localPost._count.usersSaved - 1,
            },
          });
        } else {
          setLocalPost({
            ...localPost,
            _count: {
              ...localPost._count,
              usersSaved: localPost._count.usersSaved + 1,
            },
          });
        }
        setIsSaved(!isSaved);
      } else {
        alert("You must be logged in to save a post");
      }
    } catch (e) {
      alert(e);
    }
  }
  return (
    <>
      <div className="arrow-container">
        {recommendedPostIdx != 0 && (
          <button
            type="button"
            className="skip-button"
            onClick={decrementIndex}
          >
            <MdNavigateBefore />
          </button>
        )}
      </div>
      <div className="recommended-post" onClick={openPost}>
        <img
          className="recommended-post-image"
          src={post.image_url ? post.image_url : "../../public/placeholder.png"}
          alt={post.name}
        />
        <div className="recommended-post-content">
          <h3>{post.name}</h3>
          <p className="price-tag">${post.price.toFixed(2)}</p>
          <div className="post-buttons">
            <div className="rec-post-like">
              <button className="rec-like-button" onClick={handleLike}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <p>{localPost._count && localPost._count.usersLiked}</p>
            </div>
            <div className="rec-post-save">
              <button className="rec-save-button" onClick={handleSave}>
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
              <p>{localPost._count && localPost._count.usersSaved}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="arrow-container">
        {recommendedPostIdx != recommendedPosts.length - 1 && (
          <button
            type="button"
            className="skip-button"
            onClick={incrementIndex}
          >
            <MdNavigateNext />
          </button>
        )}
      </div>
    </>
  );
}
