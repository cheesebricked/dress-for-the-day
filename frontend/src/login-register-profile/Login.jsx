import { useState } from "react";


export default function Login() {
    // logreg = login + register
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div className="logreg-box">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="email"><h3>Email: </h3></label>
                <input className="input-bar" 
                    type="text" 
                    required 
                    value={email}
                    placeholder="Email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="form-label" htmlFor="password"><h3>Password:  </h3></label>
                <input className="input-bar" 
                    type="password" 
                    required 
                    value={password}
                    placeholder="Password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                </form>
            </div>
        </>
    )
}