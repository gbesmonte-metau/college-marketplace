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
            <div className='register-box'>
                <div className='register-body'>
                    <h2>Welcome!</h2>
                    <form className='register-form' onSubmit={HandleRegister}>
                        <div>
                            <p>Email:</p>
                            <input type="text" placeholder="Email" required/>
                        </div>
                        <div>
                            <p>Username:</p>
                            <input type="text" placeholder="Username" required/>
                        </div>
                        <div>
                            <p>Password:</p>
                            <input type="password" placeholder="Password" required/>
                        </div>
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
  )
}
