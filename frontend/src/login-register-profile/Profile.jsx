import GetUserLikes from "../GetUserLikes"
import { userLikesAtom } from "../Global"
import { useAtom } from "jotai"
import ImageF from "../home/ImageF"

export default function Profile() {
    const [userLikes] = useAtom(userLikesAtom)

    return (
        <>
            <GetUserLikes />
            <h1>User profile</h1>
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