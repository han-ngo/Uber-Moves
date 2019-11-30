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
        
        // West Village
        let preset1Coord = { x: -74.00159841918946, y: 40.73340256575554 };
        document.getElementById("preset1").onclick = (e)=>{
            map.SetCenterAndZoom([preset1Coord.x, preset1Coord.y], 13);
            setTimeout(()=>{
                map.SetSelection(preset1Coord);
            }, 1500);
            // from 21 to 3
            hourCircularSlider.setSection((2.0 * Math.PI / 24) * 21, (2.0 * Math.PI / 24) * 3);
            // from Fri to Sun
            weekCircularSlider.setSection((2.0 * Math.PI / 7) * 4, (2.0 * Math.PI / 7) * 7);
        }
        // Upper East Side
        let preset2Coord = { x: -73.95318991088868, y: 40.77387674487554 };
        document.getElementById("preset2").onclick = (e)=>{
            map.SetCenterAndZoom([preset2Coord.x, preset2Coord.y], 13);
            setTimeout(()=>{
                map.SetSelection(preset2Coord);
            }, 1500);
            // from 6 to 10
            hourCircularSlider.setSection((2.0 * Math.PI / 24) * 6, (2.0 * Math.PI / 24) * 11);
            // from Mon to Fri
            weekCircularSlider.setSection((2.0 * Math.PI / 7) * 0, (2.0 * Math.PI / 7) * 5);
        }
        // Midtown Center
        let preset3Coord = { x: -73.97280222320558, y: 40.7587607338547};
        document.getElementById("preset3").onclick = (e)=>{
            map.SetCenterAndZoom([preset3Coord.x, preset3Coord.y], 14);
            setTimeout(()=>{
                map.SetSelection(preset3Coord);
            }, 1500);
            // from 15 to 20
            hourCircularSlider.setSection((2.0 * Math.PI / 24) * 15, (2.0 * Math.PI / 24) * 20);
            // from Mon to Fri
            weekCircularSlider.setSection((2.0 * Math.PI / 7) * 0, (2.0 * Math.PI / 7) * 5);
        }
    });

})


