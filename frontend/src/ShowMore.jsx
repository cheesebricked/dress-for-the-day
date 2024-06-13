import { imgNumberAtom } from "./Global"
import { useAtom } from "jotai"


export default function ShowMore() {
    const [imgNum, setImgNum] = useAtom(imgNumberAtom)

    return (
        <>
            <button class="show-more" onClick={() => setImgNum(imgNum + 10)}>
                <h2>Show more</h2>
            </button>
        </>
    )
}