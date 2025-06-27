import React from 'react'
import '../components-css/CreatePost.css'
import { categoryArr, GetCategoryIdByName } from '../../utils'
import { useContext } from 'react'
import { UserContext } from '../App';
import { useNavigate } from 'react-router';

export default function CreatePost({setIsCreatePostOpen}) {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    async function HandleCreate(e) {
        e.preventDefault()
        if (!user){
            alert("You must be logged in to create a post");
            return;
        }
        const settings = {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price: parseFloat(e.target[0].value),
                category: parseInt(e.target[1].value),
                name: e.target[2].value,
                description: e.target[3].value || "",
                condition: e.target[4].value,
                brand: e.target[5].value || "",
                color: e.target[6].value || "",
                time_created: Date.now().toString(),
                location: "{}",
                authorId: user.id,
            })
        };
        console.log(settings.body);
        try {
            const response = await fetch(import.meta.env.VITE_URL + '/posts', settings);
            const result = await response.json();
            if (response.ok){
                alert("Post created successfully");
                setIsCreatePostOpen(false);
                navigate('/');
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
        <div className='create-modal'>
            <div className='create-body'>
                <div>
                    <h2>Create Post</h2>
                    <form onSubmit={HandleCreate}>
                        <input type="text" placeholder="Price" required/>
                        <select name="category" id="category">
                            {categoryArr.slice(1,categoryArr.length).map((category, index) =>
                                <option key={index} value={GetCategoryIdByName(category)}>{category}</option>
                            )}
                        </select>
                        <input type='text' placeholder='Name' required/>
                        <input type='text' placeholder='Description'/>
                        <select name="condition" id="condition">
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                        <input type='text' placeholder='Brand'/>
                        <input type='text' placeholder='Color'/>
                        <button type='submit'>Create</button>
                        <button onClick={() => setIsCreatePostOpen(false)}>Close</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
