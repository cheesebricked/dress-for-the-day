import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { loggedInAtom } from "./Global"

export default function LoginOrUser() {
    const [loggedIn, setLoggedIn] = useAtom(loggedInAtom)
    const [link, setLink] = useState("/")
    const [linkText, setLinkText] = useState("Login / Register")

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