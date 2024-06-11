import ImageF from "./ImageF";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { seasonAtom, genderAtom } from "./Global"


export default function ImageDisplayer() {
    const [results, setResults] = useState([])
    const [season] = useAtom(seasonAtom)
    const [genderExpr] = useAtom(genderAtom)

    function getImages(pageNum) {
        // searches google images for images

        fetch(`http://127.0.0.1:5000/fashion?season=${season}&gender=${genderExpr}&img_count=${pageNum}`)
            // data => json
            .then(response => {
                return response.json()
            })
            // get parts of data
            .then(data => {
                console.log(data)
                setResults(data.items);
            })
    }

    useEffect(() => {
        getImages(1);  //UNCOMMENT WHEN WANT TO TEST GOOGLE IMAPGE API
    }, [])

    return (
        <>
            <div class="search-result">
                { 
                    results.map(function(item) {
                        const img = item.link
                        const link = item.image.contextLink
                        return (<>
                            <ImageF image={img} linkImage={link}/>
                        </>)
                    }) 
                }
            </div>
        </>
    )
}