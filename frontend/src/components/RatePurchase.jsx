import React from 'react'
import { useState } from 'react';
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

export default function RatePurchase({postDetails}) {
    const ratingOptions = [1, 2, 3, 4, 5];
    const [rating, setRating] = useState(null);

    async function UpdateRating(e) {
        e.preventDefault();
        const response = await fetch(import.meta.env.VITE_URL + '/purchases/' + postDetails.id + '/rating', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({rating}),
        });
        const data = await response.json();
        console.log(data);
    }
    return (
        <div className='purchase-modal'>
            <div className='purchase-body'>
                <h3>Purchase successful</h3>
                <p>How would you rate your seller?</p>
                <p>Your rating will be used to recommend you posts in the future.</p>
                <form onSubmit={UpdateRating}>
                    {ratingOptions.map((option, idx) => (
                        <button key={idx} type="button" onClick={() => setRating(option)}>
                            <span className="star">{rating && option <= rating ? <FaStar/> : <FaRegStar/>}</span>
                        </button>)
                    )}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}
