// function httpGetAsync(theUrl, callback) {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function () {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
//     xmlHttp.send(null);
// }

// d3.json("data/here.json").then(here => {
//     // let testHereRestApi = () => {
//     //     let lat = 40.769;
//     //     let lon = -73.9549;

//     //     let appId = here.APP_ID;
//     //     let appCode = here.APP_CODE;

//     //     httpGetAsync(`https://places.cit.api.here.com/places/v1/autosuggest?at=${lat},${lon}&q=chrysler&app_id=${appId}&app_code=${appCode}`, (result) => {
//     //         console.log(result);
//     //     });
//     // }
// });

d3.json("data/newyork.geojson").then(nyGeoJson => {
    d3.csv("data/data_with_district.csv").then(uberData => {



        // processing, convert date string like "4/1/2014 0:11:00" to Javascript Date class
        for (let item of uberData) {
            item.date = new Date(item["Date/Time"]);
        }

        AppManager.getInstance().UberData = uberData;
        AppManager.getInstance().NewYorkGeoJson = nyGeoJson;

        let map = new GeoMap();
        AppManager.getInstance().setMap(map);
        map.update(uberData);
        
        // map.onSelection((data)=>{
        //     console.log(data);
        // });

        // bar charts

        let bar = new Bars(uberData);
        bar.createBars();

        // circular slider
        let weekCircularSliderContainer =
            document.getElementById("weekDaySlider");
        let weekCircularSlider = new CircularSlider(weekCircularSliderContainer, 7, true);
        weekCircularSlider.axisTextFunc = (index) => {
            switch (index) {
                case 0:
                    return 'Mon';
                    break;
                case 1:
                    return 'Tue'
                    break;
                case 2:
                    return 'Wes'
                    break;
                case 3:
                    return 'Thu'
                    break;
                case 4:
                    return 'Fri'
                    break;
                case 5:
                    return 'Sat'
                    break;
                case 6:
                    return 'Sun'
                    break;
                default:
                    break;
            }
        };
        weekCircularSlider.init();
        weekCircularSlider.addOnChangeListener((arr) => {
            map.filtByWeekDayArr(arr);
            bar.filtByWeekDayArr(arr);

        });

        let hourCircularSliderContainer =
            document.getElementById('hourSlider');
        let hourCircularSlider = new CircularSlider(hourCircularSliderContainer, 24, false);
        hourCircularSlider.axisTextFunc = (index) => {
            return index.toString() + ":00";
        };
        hourCircularSlider.init();
        hourCircularSlider.addOnChangeListener((arr) => {
            map.filtByHourTimeArr(arr);
            bar.filtByHourTimeArr(arr);

        });

        // table
        let table = new Table(uberData);
        table.createTable();
        
        document.getElementById("preset1").onclick = (e)=>{
            map.SetCenterAndZoom([-73.88227539062501, 40.7743300930085], 12);
            setTimeout(()=>{
                map.SetSelection({x: -73.88227539062501, y: 40.7743300930085});
            }, 700);
            hourCircularSlider.setSection(0.5, 1.0);
        }

        let preset2Coord = {x: -73.973059715271, y: 40.75855756555458};
        document.getElementById("preset2").onclick = (e)=>{
            map.SetCenterAndZoom([preset2Coord.x, preset2Coord.y], 14);
            setTimeout(()=>{
                map.SetSelection(preset2Coord);
            }, 700);
            
            // // from 5 to 10
            // hourCircularSlider.setSection((2.0 * Math.PI / 24) * 5, (2.0 * Math.PI / 24) * 10);
            // // from Mon to Wes
            // weekCircularSlider.setSection((2.0 * Math.PI / 7) * 0, (2.0 * Math.PI / 7) * 3);
        }

        let preset3Coord = {x: -74.0007401123047, y: 40.749231472225716};
        document.getElementById("preset3").onclick = (e)=>{
            map.SetCenterAndZoom([preset3Coord.x, preset3Coord.y], 13);
            setTimeout(()=>{
                map.SetSelection(preset3Coord);
            }, 700);
        }
    });

})


