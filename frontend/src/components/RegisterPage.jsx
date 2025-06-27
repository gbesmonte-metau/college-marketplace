import React from 'react'
import { useNavigate } from 'react-router';

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
            console.log(result);
            navigate("/login", result);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="page">
            <div>
                <form onSubmit={HandleRegister}>
                    <input type="text" placeholder="Email" required/>
                    <input type="text" placeholder="Username" required/>
                    <input type="password" placeholder="Password" required/>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
  )
}
