import React from 'react';
import '../components-css/EditPost.css'
import { categoryArr, GetCategoryIdByName } from '../../utils';
import {useState} from 'react';

export default function EditPost({postDetails, setIsEditOpen}) {
    const [editPost, setEditPost] = useState(postDetails);

    async function HandleEdit(e) {
        e.preventDefault();
        const settings = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price: parseFloat(e.target[0].value) || undefined,
                category: parseInt(e.target[1].value) || undefined,
                name: e.target[2].value || undefined,
                description: e.target[3].value || undefined,
                condition: e.target[4].value || undefined,
                brand: e.target[5].value || undefined,
                color: e.target[6].value || undefined,
            })
        };
        console.log(settings.body);
        try {
            const response = await fetch(import.meta.env.VITE_URL + `/posts/${postDetails.id}`, settings);
            const result = await response.json();
            if (response.ok){
                alert("Post edit");
                setIsEditOpen(false);
            }
            else{
                alert(result.message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='edit-modal'>
            <div className='edit-body'>
                <h2>Edit Post</h2>
                <form onSubmit={HandleEdit}>
                    <input type="text" placeholder="Price" value={editPost.price} onChange={(e) => setEditPost({...editPost, price : e.target.value})}/>
                    <select name="category" id="category">
                        {categoryArr.slice(1,categoryArr.length).map((category, index) =>
                            <option key={index} value={GetCategoryIdByName(category)}>{category}</option>
                        )}
                    </select>
                    <input type='text' placeholder='Name'/>
                    <input type='text' placeholder='Description'/>
                    <select name="condition" id="condition">
                        <option value="new">New</option>
                        <option value="used">Used</option>
                    </select>
                    <input type='text' placeholder='Brand'/>
                    <input type='text' placeholder='Color'/>
                    <button type='submit'>Update</button>
                    <button onClick={() => setIsEditOpen(false)}>Close</button>
                </form>

            </div>
        </div>
    )
}
