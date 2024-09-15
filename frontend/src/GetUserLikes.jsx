import { backendURL } from "./Global";
import { useAtom } from "jotai";
import { userLikesAtom } from "./Global";
import { useEffect } from "react";

export default function GetUserLikes() {
    const [userLikes, setUserLikes] = useAtom(userLikesAtom)

    function getLikes() {
        fetch(`${backendURL}/get_user_likes`, {
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
            setUserLikes(data.user_likes)
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
    }

    useEffect(() => {
        getLikes()
    }, [])


    return (
        <>
        </>
    )
}