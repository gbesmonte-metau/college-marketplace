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
            console.log(error);
        }
    }
    return (
        <div className="page">
            <div className='login-body'>
                <h2>Log in</h2>
                <form className='login-form' onSubmit={HandleLogin}>
                    <input type="text" placeholder="Email" required/>
                    <input type="password" placeholder="Password" required/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}
