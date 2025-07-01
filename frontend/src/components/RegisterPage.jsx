import React from 'react'
import { useNavigate } from 'react-router';
import '../components-css/RegisterPage.css'

export default function RegisterPage() {
    const navigate = useNavigate();

    async function HandleRegister(e){
        e.preventDefault();
        const settings = {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: e.target[0].value,
                username: e.target[1].value,
                password: e.target[2].value,
            })
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + '/users/register', settings);
            const result = await response.json();
            alert(result);
            navigate("/login", result);
        }
        catch (error) {
            alert(error);
        }
    }

    return (
        <div className="page">
            <div className='register-body'>
                <h2>Register</h2>
                <form className='register-form' onSubmit={HandleRegister}>
                    <input type="text" placeholder="Email" required/>
                    <input type="text" placeholder="Username" required/>
                    <input type="password" placeholder="Password" required/>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
  )
}
