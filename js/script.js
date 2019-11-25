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
            document.createElement('div');
        document.body.appendChild(weekCircularSliderContainer);
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
        });

        let hourCircularSliderContainer =
            document.createElement('div');
        document.body.appendChild(hourCircularSliderContainer);
        let hourCircularSlider = new CircularSlider(hourCircularSliderContainer, 24, false);
        hourCircularSlider.axisTextFunc = (index) => {
            return index.toString() + ":00";
        };
        hourCircularSlider.init();
        hourCircularSlider.addOnChangeListener((arr) => {
            map.filtByHourTimeArr(arr);
        });

        // hour slider
        let hourSliderContainer = d3.select("body").append("div")
            .attr("id", 'hourSlider');
        let hourSlider = new BrushSlider(hourSliderContainer, new BrushConfig());
        hourSlider.onClear = () => {
            // map.filtByHourTime(0, 24);
            bar.filtByHourTime(0, 24);

        };
        hourSlider.onChange = (from, to) => {
            // map.filtByHourTime(from, to);
            bar.filtByHourTime(from, to);

        };

        // date slider
        let dateSliderContainer = d3.select("body").append("div")
            .attr("id", 'dateSlider');
        // from 1 = sunday to 7 = saturday
        let dateSlider = new BrushSlider(dateSliderContainer, new BrushConfig(400, 50, 10, 10, 1, 7, 7));
        dateSlider.onClear = () => {
            // map.filtByWeekDay(0, 6);
            bar.filtByWeekDay(0, 6);

        };
        dateSlider.onChange = (from, to) => {
            // map.filtByWeekDay(from, to);
            bar.filtByWeekDay(from, to);

        };

        // table
        let table = new Table(uberData);
        table.createTable();
    });

})


