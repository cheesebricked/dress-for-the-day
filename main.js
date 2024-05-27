const searchResult = document.querySelector('.search-result');
const tempDesc = document.querySelector('.temp-desc');
const tempDeg = document.querySelector('.temp-deg');
const timezone = document.querySelector('.timezone');
const tempSymb = document.querySelector('.temp-symb');
const genderExpr = document.querySelector('.select-gender');
const seasonSelect = document.querySelector('.select-season');

function getLoc() {

    // gets the longitute and latitude

    let long;
    let lat;

    // turns the given html class into what is varable is assigned

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition
        (pos => {
            long = pos.coords.longitude;
            lat = pos.coords.latitude;

            // api is link to request data

            //const api = keyWeather(lat, long)

            // arrow allows function to run with that variable (i think?)


            // fetch command fetches data
            fetch(`http://127.0.0.1:5000/weather?lat=${lat}&long=${long}`)
                // data => json
                .then(response => {
                    return response.json()
                })

                // get parts of data
                .then(data => {
                   //console.log(data);
                   const {apparentTemperature, summary, icon} = data.currently;

                   tempDeg.textContent = apparentTemperature;
                   tempDesc.textContent = summary;
                   timezone.textContent = data.timezone;

                   setIcon(icon, document.querySelector('.icon'));

                })

                .catch(console.error)
        });


    }

    else
    {
        alert("Please enable Geolocation.");
    }

};

function setIcon(icon1, iconID)
{
    // get icon
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon1.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
};

function changeSymb(class0, toggle, opt1, opt2) {

    // abstract fn for change symbol
    // HTML class, X, Y => X or Y

    if (class0.textContent === toggle){
        class0.textContent = opt2;
    }

    else {
        class0.textContent = opt1;
    }
}

function changeTemp() {
    //toggle temp between F and C

    if (tempSymb.textContent === "F"){
        tempDeg.textContent = ((tempDeg.textContent * (9/5)) + 32).toFixed(2);
    }

    else {
        tempDeg.textContent = ((tempDeg.textContent - 32) * (5/9)).toFixed(2);
    }

}

function changeDeg() {
    // toggle symbol from F to C

    changeSymb(tempSymb, "F", "F", "C");
    changeTemp();
}

function getSeason() {
    // gets the season based on the current month as a string

    const d = new Date();
    const month = d.getMonth();

    switch(month) {
        // dec - feb is winter

        case 11:
        case 0:
        case 1:
            return "winter";
            break;
        
        case 2:
        case 3:
        case 4:
            return "spring";
            break;

        case 5:
        case 6:
        case 7:
            return "summer";
            break;

        case 8:
        case 9:
        case 10:
            return "fall";
    }

}

function getYear() {
    //returns year as a string

    const d = new Date();
    return String(d.getFullYear());
}


function searchImages(imgCount) {
    // searches google images for images

    //const api = keyFashion(seasonSelect.value, getYear(), genderExpr.value, imgCount)

    fetch(`http://127.0.0.1:5000/fashion?season=${seasonSelect.value}&gender=${genderExpr.value}&img_count=${imgCount}`)
        // data => json
        .then(response => {
            return response.json()
        })

        // get parts of data
        .then(data => {
            const results =  data.items;
            
            results.map((item) => {
                // gets image and link for every item in results

                const image = document.createElement("img");
                image.src = item.link;
                const imageLink = document.createElement("a");
                imageLink.href = item.image.contextLink;
                imageLink.target = "_blank";

                imageLink.appendChild(image);
                searchResult.appendChild(imageLink);
            })

        })
}

function getCSS(elem, var0) {
    // takes 2 strings. gets the value of a specified ccs elem
    // elem should be formatted '.elem'

    var element = document.querySelector(elem),
    style = window.getComputedStyle(element),
    thing = style.getPropertyValue(var0);
}

function newImgs() {
    // adds new images

    let root = document.querySelector(':root');

    searchImages(searchResult.childElementCount + 1);
    root.style.setProperty('--img-height', (getCSS('.search-result', 'height') + 1800))

} 

function removeImg() {
    // removes all images from screen

    while(searchResult.firstElementChild) {
        searchResult.firstElementChild.remove();
    } 
}

function newSearch() {
    removeImg();
    searchImages(1);
}

function initialize() {
    // functions to run on page load

    seasonSelect.value = getSeason();

    getLoc();
    searchImages(1);

}

// run on page load
window.addEventListener('load', () => initialize());