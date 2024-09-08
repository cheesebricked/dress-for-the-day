import { useState } from "react"
import HeartLike from "./HeartLike"

export default function ImageF({ image, linkImage }) {
    return (
        <>
            <a href={linkImage} target="_blank" loading="lazy">
                <img src={image}></img>
            </a>
            <HeartLike img={image} imgUrl={linkImage}/>
        </>
    )
}