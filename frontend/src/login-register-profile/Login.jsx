import { useState } from "react";
import { Link } from "react-router-dom"


export default function Login() {
    // logreg = login + register
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({email, password, confirmPass})
    }

    return (
        <>
            <h2 className="home-button">
                <Link to="/">
                    Home
                </Link>
            </h2>
            <div className="logreg-box">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="email"><h3>Email: </h3></label>
                    <input className="input-bar" 
                        type="email" 
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
                    <label className="form-label" htmlFor="confirm-password"><h3>Confirm password:  </h3></label>
                    <input className="input-bar" 
                        type="password" 
                        required 
                        value={confirmPass}
                        placeholder="Confirm password"
                        id="confirm-password"
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                    <br />
                    <button className="submit-creds" type="submit"><h2>Submit</h2></button>
                    <h4 className="register-link">Don't have an account?&nbsp;
                        <span>
                            <Link to="/register">Register here</Link>
                        </span>.
                    </h4>
                </form>
            </div>
        </>
    )
}