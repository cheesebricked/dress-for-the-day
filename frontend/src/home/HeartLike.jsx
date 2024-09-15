import { CgHeart } from "react-icons/cg";
import { useAtom } from "jotai";
import { backendURL, userLikesAtom } from "../Global";
import { useEffect, useState } from "react";

export default function HeartLike({ img, imgUrl }) {
    const [liked, setLiked] = useState(false)
    const [userLikes, setUserLikes] = useAtom(userLikesAtom)

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
            setLiked(true)
            let existsInDict = false;
            userLikes.forEach((like) => {
                if (like.image === img) {
                    existsInDict = true
                }
            });
            if (!existsInDict) { // if like is liked and is not in userLikes, add it
                setUserLikes([...userLikes, {
                    "image" : `${img}`,
                    "image_link" : `${imgUrl}`
                }])
            }
            console.log(`like with url ${imgUrl} added to current user`)
            console.log(data.message)
        })
        .catch((error) => {
            alert("Error: Not logged in!");
        });
    }

    const handleUnlike = () => {
        fetch(`${backendURL}/remove_like_from_user?img_url=${img}&like_url=${imgUrl}`, {
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
            setLiked(false)
            let existsInDict = false;
            userLikes.forEach((like) => {
                if (like.image === img) {
                    existsInDict = true
                }
            });
            if (existsInDict) { // if like is not liked and is in userLikes, remove it
                setUserLikes(userLikes.filter((like) => like.image != img))
            }
            console.log(`like with url ${imgUrl} removed from current user`)
            console.log(data.message)
        })
        .catch((error) => {
            alert(`Error: ${error}`);
        });
    }

    useEffect(() => {
        userLikes.forEach((like) => {
            if (like.image === img) {
                setLiked(true)
            }
        });
    }, [])

    return (
        <>
            <div className="like">
                <CgHeart onClick={ liked ? handleUnlike : handleLike }/>
            </div>
        </>
    )
}