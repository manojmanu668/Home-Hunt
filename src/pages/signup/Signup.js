import React, { useState } from 'react'
import './Signup.css'

import { useSignup } from '../../hooks/useSignup'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')


    const { error,isPending, signup} = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email,password, displayName)
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Create Account</h2>
            <label>
                <span>Email:</span>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                <span>Password:</span>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <label>
                <span>Name:</span>
                <input 
                    type="text" 
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </label>
            {!isPending && <button className="btn">Sign Up</button>}
            {isPending && <button className="btn" disabled>loading</button>}
            {error && <p className='error'>{error}</p>}
        </form>
    )
}

export default Signup
