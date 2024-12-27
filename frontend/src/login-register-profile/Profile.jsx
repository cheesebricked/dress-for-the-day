import GetUserLikes from "../getUserLikes"
import { userLikesAtom } from "../Global"
import { useAtom } from "jotai"
import ImageF from "../home/ImageF"
import { Link, useNavigate } from "react-router-dom"
import { backendURL } from "../Global";

export default function Profile() {
    const [userLikes] = useAtom(userLikesAtom)
    const navigate = useNavigate();

    const deleteJWT = () => {
        document.cookie = `jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`jwt_token cookie deleted`);
        navigate("/")
      };

    return (
        <>
            <GetUserLikes />
            <h2 className="home-button">
                <Link to="/">
                    Home
                </Link>
            </h2>
            {/*<button className="logout" onClick={() => deleteJWT()}>
                Log out
            </button>*/}

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