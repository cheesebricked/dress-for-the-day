import { useEffect } from "react"
import ImageDisplayer from "./ImageDisplayer"
import { useAtom } from "jotai"
import { seasonAtom, genderAtom } from "../Global"

export default function SelectorMenu() {
    const [genderExpr, setGenderExpr] = useAtom(genderAtom)
    const [season, setSeason] = useAtom(seasonAtom)

    function getSeason() {
        // gets the season based on the current month as a string
    
        const d = new Date().getMonth();
    
        switch(d) {
            case 11:
            case 0:
            case 1:
                return "winter";

            case 2:
            case 3:
            case 4:
                return "spring";
    
            case 5:
            case 6:
            case 7:
                return "summer";
    
            case 8:
            case 9:
            case 10:
                return "fall";
        }
    }

    useEffect(() => {
        setSeason(getSeason)
    }, [])

    return (
        <>
            <div class="dropdown" id="selector">
                <h3 class="dropdown-aligner">
                    <span>
                        <select name="expression" 
                        class="select-gender" 
                        title="Click to change" 
                        value={genderExpr} 
                        onChange={(e) => setGenderExpr(e.target.value)}>
                            <option value="for women">Feminine</option>
                            <option value="gender neutral">Gender Neutral</option>
                            <option value="for men">Masculine</option>
                        </select>
                        outfits for
                        <select name="season" 
                        class="select-season" 
                        title="Click to change" 
                        value={season} 
                        onChange={(e) => setSeason(e.target.value)}>
                            <option value="fall">Fall</option>
                            <option value="winter">Winter</option>
                            <option value="summer">Summer</option>
                            <option value="spring">Spring</option>
                        </select>
                    </span>
                </h3>
            </div>

            <ImageDisplayer season={season} genderExpr={genderExpr}/>
        </>
    )
}