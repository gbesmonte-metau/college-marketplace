import React from 'react'
import { useNavigate } from 'react-router';
import '../components-css/RegisterPage.css'

import { MdErrorOutline } from "react-icons/md";


export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');

    async function HandleRegister(e){
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
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
                email: email,
                username: username,
                password: password,
            })
        };
        try {
            const response = await fetch(import.meta.env.VITE_URL + '/users/register', settings);
            const result = await response.json();
            if (response.ok){
                alert("You have successfully registered!")
                setError(null);
                navigate("/login", result);
            }
            else {
                setError(result.message);
            }
        }
        catch (error) {
            alert(error.message);
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
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Username:</p>
                            <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Password:</p>
                            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Confirm Password:</p>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}required/>
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    <div className={`error-box ${error ? 'visible' : 'hidden'}`}>
                        <MdErrorOutline/> <p> Error: {error || 'No error'}</p>
                    </div>
                </div>
            </div>
        </div>
  )
}
