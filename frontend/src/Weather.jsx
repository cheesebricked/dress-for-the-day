import Skycons, { SkyconsType } from 'react-skycons'
import { useEffect, useState } from 'react';

export default function Weather() {
    const [tempDeg, setTempDeg] = useState(0)
    const [tempSymb, setTempSymb] = useState("F")
    const [tempDesc, setTempDesc] = useState("CLEAR_DAY")      // temp starts in F
    const [timezone, setTimezone] = useState(null)
    const [iconWeather, setIconWeather] = useState(null)

    function getLoc() {
        let lat;
        let long;

        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition
            (pos => {
                long = pos.coords.longitude;
                lat = pos.coords.latitude;
    
                // fetch command fetches data
                fetch(`http://127.0.0.1:5000/weather?lat=${lat}&long=${long}`)
                    // data => json
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                       const {apparentTemperature, summary, icon} = data.currently;
    
                       setIconWeather(icon)
    
                       setTempDeg(apparentTemperature)
                       setTempDesc(summary)
                       setTimezone(data.timezone)
    
                    })
                    .catch(console.error)
            });
        }
        else
        {
            alert("Please enable Geolocation.");
        }
    };

    function changeTemp() {
        if (tempSymb === "F"){
            setTempDeg(((tempDeg - 32) * (5/9)).toFixed(2))
            setTempSymb("C")
        }
        else {
            setTempDeg(((tempDeg * (9/5)) + 32).toFixed(2))
            setTempSymb("F")
        }
    }

    useEffect(() => {
        getLoc()
    }, [tempDesc, timezone])

    const skyconners =  new Map([
        ["clear-day" , 'CLEAR_DAY'],
        ["clear-night" , 'CLEAR_NIGHT'],
        ["parly-cloudy-day" , 'PARTLY_CLOUDY_DAY'],
        ["partly-cloudy-night" , 'PARTLY_CLOUDY_NIGHT'],
        ["cloudy" , 'CLOUDY'],
        ["rain" , 'RAIN'],
        ["sleet" , 'SLEET'],
        ["snow" , 'SNOW'],
        ["wind" , 'WIND'],
        ["fog" , 'FOG']
    ])

    return (
        <>
            <div class="temp-main">
                <div class="location">
                    <h1 class="timezone">{ timezone }</h1>
                    <h3 class="offset"></h3>
                    <Skycons
                        type={skyconners.get(iconWeather)}
                        animate={true}
                        size={64}
                    />
                </div>

                <div class="temp"> 
                    <div class="degree-sec" title="Click to alternate between F and C" onClick={changeTemp}>
                        <h2 class="temp-deg">{ tempDeg }</h2>
                        <h2 class="temp-deg-symb">°</h2>
                        <span class="temp-symb"> { tempSymb }</span>
                    </div>
                    <div class="temp-desc">{ tempDesc }</div>
                </div>
            </div>
        </>
    )
}