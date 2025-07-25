import { useState, useEffect, use } from "react";
import "../components-css/ProfilePage.css";
import Post from "./Post";
import EditProfile from "./EditProfile";
import { getRequest } from "../api";
import Loading from "./Loading";

const mode = {
  Likes: 0,
  Saves: 1,
  Purchased: 2,
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [boughtPosts, setBoughtPosts] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modeState, setModeState] = useState(mode.Likes);
  const [isLoading, setIsLoading] = useState(false);

  async function getProfile() {
    setIsLoading(true);
    const response = await getRequest(import.meta.env.VITE_URL + "/user", true);
    const result = await response.json();
    if (response.ok) {
      setUserInfo(result);
    }
  }

  async function getLikedPosts() {
    const response = await getRequest(import.meta.env.VITE_URL + "/user/likes", true);
    const result = await response.json();
    if (response.ok) {
      setLikedPosts(result);
    }
  }

  async function getSavedPosts() {
    const response = await getRequest(import.meta.env.VITE_URL + "/user/saves", true);
    const result = await response.json();
    if (response.ok) {
      setSavedPosts(result);
    }
  }

  async function getBoughtPosts() {
    const response = await getRequest(import.meta.env.VITE_URL + "/bought", true);
    const result = await response.json();
    if (response.ok) {
      setBoughtPosts(result);
    }
    setIsLoading(false);
  }

  function handleEdit() {
    setIsEditOpen(true);
  }

  useEffect(() => {
    getProfile();
    getLikedPosts();
    getSavedPosts();
    getBoughtPosts();
  }, [isEditOpen]);

  return (
    <div className="page">
      <Loading isLoading={isLoading}></Loading>
      <div className="profile-body">
        <div className="profile-info">
          <img
            className="profile-pic-large"
            src={userInfo.icon || "../../public/placeholder.png"}
            alt="profile_pic"
          />
          <div>
            <h3>{userInfo.username}</h3>
            <p>Bio: {userInfo.bio}</p>
            <p>
              Location:{" "}
              {userInfo.formatted_address
                ? userInfo.formatted_address
                : "No location"}
            </p>
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          </div>
        </div>
        <nav>
          <ul>
            {Object.keys(mode).map((key, idx) =>
              modeState == mode[key] ? (
                <li
                  key={idx}
                  className="selected"
                  onClick={() => setModeState(mode[key])}
                >
                  {key}
                </li>
              ) : (
                <li key={idx} onClick={() => setModeState(mode[key])}>
                  {key}
                </li>
              )
            )}
          </ul>
        </nav>
        {modeState == mode.Likes && (
          <div className="liked-posts">
            {likedPosts && likedPosts.length > 0 ? (
              likedPosts.map((post, idx) => <Post key={idx} post={post}></Post>)
            ) : (
              <p>No liked posts</p>
            )}
          </div>
        )}
        {modeState == mode.Saves && (
          <div className="saved-posts">
            {savedPosts && savedPosts.length > 0 ? (
              savedPosts.map((post, idx) => <Post key={idx} post={post}></Post>)
            ) : (
              <p>No saved posts</p>
            )}
          </div>
        )}
        {modeState == mode.Purchased && (
          <div className="purchased-posts">
            {boughtPosts && boughtPosts.length > 0 ? (
              boughtPosts.map((post, idx) => (
                <Post key={idx} post={post}></Post>
              ))
            ) : (
              <p>No purchases</p>
            )}
          </div>
        )}
      </div>
      {isEditOpen && (
        <EditProfile userInfo={userInfo} setIsEditOpen={setIsEditOpen} />
      )}
    </div>
  );
}
