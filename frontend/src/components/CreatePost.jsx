import React from 'react'
import '../components-css/CreatePost.css'
import { categoryArr, GetCategoryIdByName, conditionArr, colorArr} from '../../utils'
import { useState, useContext } from 'react'
import { UserContext } from '../App';
import { useNavigate } from 'react-router';
import { fetchCreatePost } from '../api';
import AddressForm from './AddressForm';
import UploadImage from './UploadImage';

export default function CreatePost({setIsCreatePostOpen}) {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    //create variables
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState(9);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("New");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("White");
    const [location, setLocation] = useState("{}");
    const [formattedAddr, setFormattedAddr] = useState("");
    const [url, setUrl] = useState("");

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
            formatted_address: formattedAddr,
            image_url: url,
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
                        <div>
                            <p>Price</p>
                            <input name="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Category</p>
                            <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categoryArr.slice(0,-1).map((category, index) =>
                                    <option key={index} value={GetCategoryIdByName(category)}>{category}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <p>Name</p>
                            <input name="name" type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Description</p>
                            <input name="description" type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
                        </div>
                        <div>
                            <p>Condition</p>
                            <select name="condition" id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} required>
                                {conditionArr.slice(0,-1).map((condition, index) =>
                                    <option key={index} value={condition}>{condition}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <p>Brand</p>
                            <input name="brand" type='text' placeholder='Brand' value={brand} onChange={(e) => setBrand(e.target.value)}/>
                        </div>
                        <div>
                            <p>Color</p>
                            <select name="color" id="color" value={color} onChange={(e) => setColor(e.target.value)}>
                                {colorArr.slice(0,-1).map((color, index) =>
                                    <option key={index} value={color}>{color}</option>
                                )}
                            </select>
                        </div>
                        <AddressForm setLocation={setLocation} setFormattedAddr={setFormattedAddr}/>
                        <UploadImage url={url} setUrl={setUrl}/>
                        <button type='submit'>Create</button>
                        <button onClick={() => setIsCreatePostOpen(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
