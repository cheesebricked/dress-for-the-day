import { useState } from "react"

export default function ImageF({ image, linkImage }) {
    const [img, setImg] = useState(image)
    const [link, setLink] = useState(linkImage)

    return (
        <>
            <a href={link} target="_blank">
                <img src={img}></img>
            </a>
        </>
    )
}