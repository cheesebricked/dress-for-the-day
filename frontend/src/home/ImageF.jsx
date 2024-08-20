import { useState } from "react"

export default function ImageF({ image, linkImage }) {
    return (
        <>
            <a href={linkImage} target="_blank" loading="lazy">
                <img src={image}></img>
            </a>
        </>
    )
}