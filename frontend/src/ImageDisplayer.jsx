import ImageF from "./ImageF";
import { useState, useEffect } from "react";

export default function ImageDisplayer({ season, genderExpr }) {
    const [seasonIn, setSeason] = useState(season)
    const [genderExprIn, setGenderExpr] = useState(genderExpr)
    const [imgList, setImgList] = useState([])

    function getImages(imgCount) {
        // searches google images for images

        fetch(`http://127.0.0.1:5000/fashion?season=${seasonIn}&gender=${genderExprIn}&img_count=${imgCount}`)
            // data => json
            .then(response => {
                return response.json()
            })
    
            // get parts of data
            .then(data => {
                console.log(data)
                const results =  data.items;
                
                results.map((item) => {
    
                    const linkToimage = item.link;
                    const linkToImageLink = item.image.contextLink;


                })
            })
    }


    return (
        <>
            <div class="search-result">
            </div>
        </>
    )
}