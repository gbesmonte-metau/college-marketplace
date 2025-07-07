import React from 'react'
import { useNavigate } from 'react-router';
import { useContext } from 'react'
import { UserContext } from '../App';
import '../components-css/LoginPage.css'

export default function LoginPage() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    async function HandleLogin(e){
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
                password: e.target[1].value,
            })
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + '/users/login', settings);
            const result = await response.json();
            setUser(result);
            navigate("/", result);
        }
        catch (error) {
            alert(error);
        }
    }
    return (
        <div className="page">
            <div className='login-box'>
                <div className='login-body'>
                    <h2>Welcome Back!</h2>
                    <form className='login-form' onSubmit={HandleLogin}>
                        <div>
                            <p>Email:</p>
                            <input type="text" placeholder="Email" required/>
                        </div>
                        <div>
                            <p>Password:</p>
                            <input type="password" placeholder="Password" required/>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
