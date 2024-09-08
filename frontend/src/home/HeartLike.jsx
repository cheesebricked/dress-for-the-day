import { CgHeart } from "react-icons/cg";
import { backendURL } from "../Global";

export default function HeartLike({ img, imgUrl }) {
    const handleLike = () => {
        fetch(`${backendURL}/add_like_to_user?img_url=${img}&like_url=${imgUrl}`, {
            method: "POST",
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
            console.log(`like with url ${imgUrl} added to current user`)
        })
        .catch((error) => {
            alert("Error: Not logged in!");
        });
    }

    return (
        <>
            <div className="like">
                <CgHeart onClick={ handleLike }/>
            </div>
        </>
    )
}