import { imgNumberAtom } from "./Global"
import { useAtom } from "jotai"


export default function ShowMore() {
    const [imgNum, setImgNum] = useAtom(imgNumberAtom)

    return (
        <>
            <button class="show-more" onClick={() => setImgNum(imgNum + 10)}>
                <a href="#top"><h2>Next page</h2></a>
            </button>
        </>
    )
}