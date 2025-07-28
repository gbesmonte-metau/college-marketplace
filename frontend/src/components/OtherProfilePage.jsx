import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router";
import { getRequest } from "../api";

export default function OtherProfilePage() {
  const [userInfo, setUserInfo] = useState({});
  const id = useParams().id;
  const location = useLocation();
  const { state } = location;

  async function getProfile() {
    const url = new URL(import.meta.env.VITE_URL + `/users/${id}`);
    const response = await getRequest(url, false);
    const result = await response.json();
    if (response.ok) {
      setUserInfo(result);
    } else {
      alert(result.message);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="page">
      <div className="profile-body">
        <img
          className="profile-pic-large"
          src={userInfo.icon}
          alt="profile_pic"
        />
        <p>Username: {userInfo.username}</p>
        <p>Bio: {userInfo.bio}</p>
        <p>
          Location:{" "}
          {userInfo.formatted_address
            ? userInfo.formatted_address
            : "No location"}
        </p>
        {state.postId && <Link to={`/posts/${state.postId}`}>Go back to post</Link>}
      </div>
    </div>
  );
}
