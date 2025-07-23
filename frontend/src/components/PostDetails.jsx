import { useNavigate, useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { categoryArr } from "../../utils";
import { useContext } from "react";
import { UserContext } from "../App";
import EditPost from "./EditPost";
import "../components-css/PostDetails.css";
import RatePurchase from "./RatePurchase";
import { getRequest, postRequest } from "../api";

export default function PostDetails() {
  const id = useParams().id;
  const [postDetails, setPostDetails] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    getPostDetails();
  }, [isEditOpen]);

  async function getPostDetails() {
    try {
      const response = await getRequest(import.meta.env.VITE_URL + `/posts/${id}`, false);
      const result = await response.json();
      if (response.ok) {
        setPostDetails(result);
      } else {
        alert(result);
      }
    } catch (error) {
      alert(error);
    }
  }

  async function handleDelete() {
    const response = await fetch(import.meta.env.VITE_URL + `/posts/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    const result = await response.json();
    if (response.ok) {
      navigate("/myposts");
    } else {
      alert(result.message);
    }
  }
  function openEdit(e) {
    e.preventDefault();
    setIsEditOpen(true);
  }

  async function handlePurchase(e) {
    e.preventDefault();
    if (!user) {
      alert("You need to login to purchase this item");
      return;
    }
    const response = await postRequest(import.meta.env.VITE_URL + `/posts/${id}/purchase`, {});
    const result = await response.json();
    if (!response.ok) {
      alert(result.message);
    } else {
      alert("Purchase successful");
    }
  }

  return (
    <div className="page">
      {postDetails && (
        <div>
          <div className="details">
            <div className="img-container">
              <img
                className="details-image"
                src={postDetails.image_url || "../../public/placeholder.png"}
                alt={postDetails.name}
              />
            </div>
            <div className="details-info">
              <div className="details-header">
                <h2>{postDetails.name}</h2>
                <h3>${postDetails.price}</h3>
                <div>
                  {postDetails.purchase ? (
                    <p>Already Purchased</p>
                  ) : (
                    <button onClick={handlePurchase}>Purchase</button>
                  )}
                </div>
                <p>
                  {user && user.id === postDetails.authorId ? (
                    <Link to={`/profile`}>My Profile</Link>
                  ) : (
                    <Link to={`/profile/${postDetails.authorId}`}>
                      View Author Details
                    </Link>
                  )}
                </p>
                <div>
                  {user && user.id === postDetails.authorId && (
                    <button onClick={handleDelete}>Delete Post</button>
                  )}
                  {user && user.id === postDetails.authorId && (
                    <button onClick={openEdit}>Edit Post</button>
                  )}
                </div>
              </div>
              <p>{postDetails.description}</p>
              <p>Location: {postDetails.formatted_address}</p>
              <p>Color: {postDetails.color}</p>
              <p>Brand: {postDetails.brand}</p>
              <p>Condition: {postDetails.condition}</p>
              <p>Category: {categoryArr[postDetails.category]}</p>
              {postDetails.purchase &&
                postDetails.purchase.buyerId === user.id && (
                  <RatePurchase postDetails={postDetails} />
                )}
            </div>
          </div>
        </div>
      )}
      {isEditOpen && (
        <EditPost postDetails={postDetails} setIsEditOpen={setIsEditOpen} />
      )}
    </div>
  );
}
