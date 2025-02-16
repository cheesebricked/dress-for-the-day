import GetUserLikes from "../getUserLikes"
import { userLikesAtom } from "../Global"
import { useAtom } from "jotai"
import ImageF from "../home/ImageF"
import { Link, useNavigate } from "react-router-dom"
import { backendURL } from "../Global";
import { useEffect, useState } from "react"

export default function Profile() {
    const [userLikes] = useAtom(userLikesAtom)
    const navigate = useNavigate();
    const [user, setUser] = useState('')

    useEffect(() => {
        fetch(`${backendURL}/get_username`, {
            method: "GET",
            credentials: 'include',
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
            setUser(data.username)
        })
    }, [])

    const deleteJWT = () => {
        document.cookie = `jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`jwt_token cookie deleted`);
        navigate("/")
      };

    return (
        <>
            <GetUserLikes />
            <div className="profile-menu">
                <h2 className="home-button">
                    <Link to="/" className="home-button-text">
                        Home
                    </Link>
                </h2>
                <h2 className="logout" onClick={() => deleteJWT()}>
                    Log out
                </h2>
            </div>
            <h1 className="username">
                Welcome back, {user}
            </h1>
            

            <div class="search-result">
                { 
                    userLikes.map(function(like) {
                        const img = like.image
                        const link = like.image_link
                        return (<>
                            <ImageF image={img} linkImage={link}/>
                        </>)
                    }) 
                }
            </div>
        </>
    )
}