import React from 'react';
import '../components-css/EditPost.css'
import { categoryArr, GetCategoryIdByName, conditionArr, colorArr} from '../../utils'
import { useState } from 'react'
import AddressForm from './AddressForm';
import UploadImage from './UploadImage';

export default function EditPost({postDetails, setIsEditOpen}) {
    const [price, setPrice] = useState(postDetails.price);
    const [category, setCategory] = useState(postDetails.category);
    const [name, setName] = useState(postDetails.name);
    const [description, setDescription] = useState(postDetails.description);
    const [condition, setCondition] = useState(postDetails.condition);
    const [brand, setBrand] = useState(postDetails.brand);
    const [color, setColor] = useState(postDetails.color);
    const [location, setLocation] = useState(postDetails.location);
    const [formattedAddr, setFormattedAddr] = useState(postDetails.formatted_address);
    const [url, setUrl] = useState(postDetails.image_url);

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
                price: parseFloat(price),
                category: parseInt(category),
                name: name,
                description: description,
                condition: condition,
                brand: brand,
                color: color,
                location: location,
                formatted_address: formattedAddr,
                image_url: url,
            })
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + `/posts/${postDetails.id}`, settings);
            const result = await response.json();
            if (response.ok){
                alert("Post edited successfully");
                setIsEditOpen(false);
            }
            else{
                alert(result.message);
            }
        }
        catch (error) {
            alert(error);
        }
    }

    return (
        <div className='edit-modal'>
            <div className='edit-body'>
                <h2>Edit Post</h2>
                <div className='edit-box'>
                    {url ? <img className='edit-post-img' src={url} alt="uploaded image" /> : <img className='edit-post-img' src='../../placeholder.png' alt="placeholder image"/>}
                    <form onSubmit={HandleEdit}>
                        <div className='edit-option'>
                            <p>Price</p>
                            <input name="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                        </div>
                        <div className='edit-option'>
                            <p>Category</p>
                            <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categoryArr.slice(0,-1).map((category, index) =>
                                    <option key={index} value={GetCategoryIdByName(category)}>{category}</option>
                                )}
                            </select>
                        </div>
                        <div className='edit-option'>
                            <p>Name</p>
                            <input name="name" type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div className='edit-option'>
                            <p>Description</p>
                            <input name="description" type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
                        </div>
                        <div className='edit-option'>
                            <p>Condition</p>
                            <select name="condition" id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
                                {conditionArr.slice(0,-1).map((condition, index) =>
                                    <option key={index} value={condition}>{condition}</option>
                                )}
                            </select>
                        </div>
                        <div className='edit-option'>
                            <p>Brand</p>
                            <input name="brand" type='text' placeholder='Brand' value={brand} onChange={(e) => setBrand(e.target.value)}/>
                        </div>
                        <div className='edit-option'>
                            <p>Color</p>
                            <select name="color" id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                                {colorArr.slice(0,-1).map((color, index) =>
                                    <option key={index} value={color}>{color}</option>
                                )}
                            </select>
                        </div>
                        <div className='edit-option'>
                            <p>Location</p>
                            {formattedAddr}
                            <AddressForm setLocation={setLocation} setFormattedAddr={setFormattedAddr}/>
                        </div>
                        <div className='edit-option'>
                            <p>Image</p>
                            <UploadImage url={url} setUrl={setUrl}/>
                        </div>
                        <button type='submit'>Save</button>
                        <button onClick={() => setIsEditOpen(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
