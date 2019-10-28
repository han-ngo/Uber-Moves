function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

d3.json("data/here.json").then(here => {
    let testHereRestApi = () => {
        let lat = 40.769;
        let lon = -73.9549;

        let appId = here.APP_ID;
        let appCode = here.APP_CODE;

        httpGetAsync(`https://places.cit.api.here.com/places/v1/autosuggest?at=${lat},${lon}&q=chrysler&app_id=${appId}&app_code=${appCode}`, (result) => {
            console.log(result);
        });
    }
});