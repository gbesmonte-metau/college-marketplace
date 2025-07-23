import { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import "../components-css/RatePurchase.css";

export default function RatePurchase({ postDetails }) {
  const ratingOptions = [1, 2, 3, 4, 5];
  const [rating, setRating] = useState(null);

  async function updateRating(e) {
    e.preventDefault();
    const response = await fetch(
      import.meta.env.VITE_URL + "/purchases/" + postDetails.id + "/rating",
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      },
    );
    const data = await response.json();
    alert("Submitted rating!");
  }
  return (
    <div className="purchase-modal">
      <div className="purchase-body">
        <h3>Purchase successful</h3>
        <p>How would you rate your seller?</p>
        <p>Your rating will be used to recommend you posts in the future.</p>
        <form onSubmit={updateRating}>
          <div>
            {ratingOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className="star-btn"
                onClick={() => setRating(option)}
              >
                <span className="star">
                  {rating && option <= rating ? <FaStar /> : <FaRegStar />}
                </span>
              </button>
            ))}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
