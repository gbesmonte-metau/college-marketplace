import React from 'react'
import '../components-css/CreatePost.css'
import { categoryArr, GetCategoryIdByName } from '../../utils'
import { useState, useContext } from 'react'
import { UserContext } from '../App';
import { useNavigate } from 'react-router';
import { fetchCreatePost } from '../api';
import Places from './AddressForm';

export default function CreatePost({setIsCreatePostOpen}) {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    //create variables
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("New");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [location, setLocation] = useState("{}");

    async function HandleCreate(e) {
        e.preventDefault()
        if (!user){
            alert("You must be logged in to create a post");
            return;
        }
        const body = {
            price: parseFloat(price),
            category: parseInt(category),
            name: name,
            description: description,
            condition: condition,
            brand: brand,
            color: color,
            time_created: Date.now().toString(),
            location: location,
            authorId: user.id,
        }
        const response = await fetchCreatePost(body);
        const result = await response.json();
        if (response.ok){
            setIsCreatePostOpen(false);
            navigate('/');
        }
        else{
            alert(result.message);
        }
    }

    return (
        <div className='create-modal'>
            <div className='create-body'>
                <div>
                    <h2>Create Post</h2>
                    <form onSubmit={HandleCreate}>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                        <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categoryArr.slice(1,categoryArr.length).map((category, index) =>
                                <option key={index} value={GetCategoryIdByName(category)}>{category}</option>
                            )}
                        </select>
                        <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                        <input type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
                        <select name="condition" id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                        <input type='text' placeholder='Brand' value={brand} onChange={(e) => setBrand(e.target.value)}/>
                        <input type='text' placeholder='Color' value={color} onChange={(e) => setColor(e.target.value)}/>
                        <Places setLocation={setLocation}></Places>
                        {location}
                        <button type='submit'>Create</button>
                        <button onClick={() => setIsCreatePostOpen(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
