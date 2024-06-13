import ImageF from "./ImageF";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { seasonAtom, genderAtom, imgNumberAtom } from "./Global"


export default function ImageDisplayer() {
    const [season] = useAtom(seasonAtom)
    const [genderExpr] = useAtom(genderAtom)
    const [imgNumber, setImgNumber] = useAtom(imgNumberAtom)
    const [results, setResults] = useState([])
    const prevSelector = useRef([season, genderExpr])
    const replacer = useRef(false)

    function getImages(imgNum, replaceImages) {
        // searches google images for images

        fetch(`http://127.0.0.1:5000/fashion?season=${season}&gender=${genderExpr}&img_count=${imgNum}`)
            // data => json
            .then(response => {
                return response.json()
            })
            // get parts of data
            .then(data => {
                setResults(replaceImages ? data.items : [...results, data.items])
            })
    }

    useEffect(() => {
        /*
        - first checks if season has been determined yet
        - if it has, then checks if we are replacing or adding images by checking of the season or gender has changed
        - finally, updates current prevSelector state, sets replace images to false

         */
        if (season === "default") { return }

        const [szn, gndr] = prevSelector.current

        if (szn !== season || genderExpr !== gndr) {
            replacer.current = true
            setImgNumber(1)
        }

        getImages(imgNumber, replacer);  //UNCOMMENT WHEN WANT TO TEST GOOGLE IMAPGE API
        prevSelector.current = [season, genderExpr]
        replacer.current = false
        
    }, [season, genderExpr, imgNumber])

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