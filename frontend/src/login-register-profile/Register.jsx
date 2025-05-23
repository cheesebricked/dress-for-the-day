import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { backendURL } from "../Global";


export default function Register() {
    // logreg = login + register
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPass", confirmPass);
        formData.append("username", username);

        fetch(`${backendURL}/register`, {
            method: "POST",
            body: formData
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new Error(data.message || "An error occurred.");
                });
            }
            return res.json();
        })
        .then((data) => {
            navigate("/profile")
        })
        .catch((error) => {
            setMessage("Error: " + error.message);
        });
    }

    

    return (
        <>
            <h2 className="home-button">
                <Link to="/">
                    Home
                </Link>
            </h2>
            <div className="logreg-box">
                <h1>Register</h1>
                <h2 className="message">{message}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="username"><h3>Username:  </h3></label>
                    <input className="input-bar" 
                        type="text" 
                        required 
                        value={username}
                        placeholder="Username"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <h4 className="register-link">Want to login?&nbsp;
                        <span>
                            <Link to="/login">Login here</Link>
                        </span>.
                    </h4>
                </form>
            </div>
        </>
    )
}