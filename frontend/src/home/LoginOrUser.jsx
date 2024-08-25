import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { loggedInAtom } from "../Global"
import { backendURL } from "../Global";

export default function LoginOrUser() {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const [link, setLink] = useState("/")
    const [linkText, setLinkText] = useState("Loading...")

    useEffect(() => {
        fetch(`${backendURL}/validate_token`, {
            method: "POST",
            credentials: 'include'
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
            setLoggedIn(true)
        })
        .catch((error) => {
            setLoggedIn(false)
            console.log("Error: " + error.message);
        });
    }, [])

    useEffect(() => {
        setLink(loggedIn ? "/profile" : "/login")
        setLinkText(loggedIn ? "My Profile" : "Login / Register")
    }, [loggedIn])
    
    return (
    <>
        <div class="my-profile">
            <h2>
                <Link to={link}>
                    {linkText}
                </Link>
            </h2>
        </div>
    </>
    )
}